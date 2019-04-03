import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getHistoryFlow (context, payload) {
      return ajax.post('/business/getHistoryFlow.action', payload.data)
    },
    async changeData (context, payload) {
      return ajax.post('/business/changeData.action', payload.data)
    },
    async copyData (context, payload) {
      return ajax.post('/business/copyData.action', payload.data)
    }
  }
}
