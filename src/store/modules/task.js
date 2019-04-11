import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async gridTask (context, payload) {
      return ajax.post('/business/gridTask.action', payload.data)
    }
  }
}
