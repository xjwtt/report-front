import _ from 'underscore'
import moment from 'moment'
import ajax from '@/lib/ajax'
import Vue from 'vue'
import i18n from '@/i18n'

const t = key => i18n.t(key)

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async query (context, payloads) {
      let args = {}
      let queryStatus = true
      for (let key in payloads) {
        let payload = payloads[key]
        let dateFields = payload.dateFields
        let st = payload.st ? payload.st : context.rootState.app.dateRange[0]
        let et = payload.et ? payload.et : context.rootState.app.dateRange[1]
        let mallIds = payload.mallIds
          ? payload.mallIds
          : payload.singelMall
            ? [context.rootState.app.selectedMall.Id]
            : _.map(context.rootState.app.selectedMalls, mall => mall.Id)

        let groupBy = []
        payload.groupBy.forEach(g => {
          let period = g.period
            ? g.period
            : context.rootState.app.timeInterval.key
          /* 判断 period 如果 period */
          let duration = moment.duration(moment(et).diff(moment(st)))
          switch (period) {
            case '5m':
            case '10m':
            case '15m':
            case '30m':
            case '60m':
              if (duration.asDays() >= 1) {
                Vue.prototype.$message.error(t('the_time_period_must_be_one_day'))
                queryStatus = false
                return
              }
              break
            // case '60m':
            //   if (duration.asDays() >= 7) {
            //     Vue.prototype.$message.error(t('the_time_period_must_be_seven_day'))
            //     queryStatus = false
            //     return
            //   }
            //   break
          }
          let timeFormatter = g.timeFormatter
            ? g.timeFormatter
            : context.rootState.app.timeInterval.timeFormatter
          let domain = g.domain
          groupBy.push({
            Period: period,
            TimeFormatter: timeFormatter,
            Domain: domain
          })
        })

        let location = payload.PhyIds
          ? {PhyIds: payload.PhyIds}
          : {MallIds: mallIds}
        st = moment(st).format('YYYY-MM-DD')
        et = moment(et).format('YYYY-MM-DD')
        let startTime = payload.startTime ? payload.startTime : ''
        let endTime = payload.endTime ? payload.endTime : ''
        args[key] = {
          DataFields: dateFields,
          StartDate: st,
          EndDate: et,
          Locations: location,
          GroupBy: groupBy,
          StartTime: startTime,
          EndTime: endTime
        }
      }
      if (queryStatus) {
        return ajax.post('report/GlobalReport.action', args)
      } else {
        return null
      }
    },
    async ConventTable (context, payload) {
      let fields = context.fields
      let table = []
      let grouped = _.groupBy(this.data.Report[0], _ => _.DomainLabel)
      for (let mallName in grouped) {
        let mall = grouped[mallName]
        for (let fieldIndex in fields) {
          let field = fields[fieldIndex]
          let row = {mallName: mallName, metric: field}
          _.each(mall, _ => {
            row[_['TimeLabel']] = _[field]
          })
          table.push(row)
        }
      }
      return table
    }
  }
}
