import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async recoverHistory (context, payload) {
      return ajax.post('/business/recoverHistory.action', payload.data)
    },
    async resetBusinessTime (context, payload) {
      return ajax.post('/business/resetBusinessTime.action', payload.data)
    }
  }
}
