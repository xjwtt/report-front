// import _ from 'underscore'
// import moment from 'moment'
import ajax from '@/lib/ajax'
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getAll (context, payload) {
      return ajax.post('business/PhysicalManager.html?op=grid', payload)
    }
  }
}
