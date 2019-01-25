import _ from 'underscore'
import moment from 'moment'
import ajax from '@/lib/ajax'
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async query (context, payload) {
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

      st = moment(st).format('YYYY-MM-DD')
      et = moment(et).format('YYYY-MM-DD')
      let args = {
        DataFields: dateFields,
        StartDate: st,
        EndDate: et,
        Locations: { MallIds: mallIds },
        GroupBy: groupBy
      }
      return ajax.post('report/GlobalReport.html?op=report', args)
    },
    async ConventTable (context, payload) {
      let fields = context.fields
      let table = []
      let grouped = _.groupBy(this.data.Report[0], _ => _.DomainLabel)
      for (let mallName in grouped) {
        let mall = grouped[mallName]
        for (let fieldIndex in fields) {
          let field = fields[fieldIndex]
          let row = { mallName: mallName, metric: field }
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
