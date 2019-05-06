import _ from 'underscore'
import moment from 'moment'
import ajax from '@/lib/ajax'

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
            : context.rootState.app.hourlyWeek.key
          /* 判断 period 如果 period */
          let timeFormatter = g.timeFormatter
            ? g.timeFormatter
            : context.rootState.app.hourlyWeek.timeFormatter
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
    }
  }
}
