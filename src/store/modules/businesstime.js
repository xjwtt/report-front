import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async gridBusinessTime (context, payload) {
      return ajax.post('/business/gridBusinessTime.action', payload.data)
    },
    async gridMallBusinessTime (context, payload) {
      return ajax.post('/business/gridMallBusinessTime.action', payload.data)
    },
    async saveOrUpdateBusinessTime (context, payload) {
      return ajax.post('/business/saveOrUpdateBusinessTime.action', payload.data)
    },
    async businessTimeSaveMalls (context, payload) {
      return ajax.post('/business/businessTimeSaveMalls.action', payload.data)
    },
    async deleteBusinessTime (context, payload) {
      return ajax.post('/business/deleteBusinessTime.action', payload.data)
    }
  }
}
