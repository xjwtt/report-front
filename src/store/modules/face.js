import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async faceGrid (context, payload) {
      return ajax.post('/report/faceGrid.action', payload.data)
    }
  }
}
