import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async faceGrid (context, payload) {
      return ajax.post('/report/faceGrid.action', payload.data)
    },
    async faceMatchGrid (context, payload) {
      return ajax.post('/report/faceMatchGrid.action', payload.data)
    },
    async faceMatchDetailGrid (context, payload) {
      return ajax.post('/report/faceMatchDetailGrid.action', payload.data)
    }
  }
}
