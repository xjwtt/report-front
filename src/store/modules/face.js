import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async faceGrid (context, payload) {
      return ajax.post('/report/faceGrid.action', payload.data)
    },
    async lastFaceGrid (context, payload) {
      return ajax.post('/report/lastFaceGrid.action', payload.data)
    },
    async lastFaceDetailGrid (context, payload) {
      return ajax.post('/report/lastFaceDetailGrid.action', payload.data)
    }
  }
}
