// import _ from 'underscore'
// import moment from 'moment'
import ajax from '@/lib/ajax'
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async select (context, payload) {
      return ajax.post('/business/SelectPhysicalManager.action', payload)
    }
  }
}
