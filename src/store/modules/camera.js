import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async userCameraGrid (context, payload) {
      return ajax.post('/business/userCameraGrid.action', payload.data)
    },
    async saveOrUpdateCamera (context, payload) {
      return ajax.post('/business/saveOrUpdateCamera.action', payload.data)
    },
    async deleteCamera (context, payload) {
      return ajax.post('/business/deleteCamera.action', payload.data)
    },
    async userCameraStatus (context, payload) {
      return ajax.post('/business/userCameraStatus.action', payload.data)
    }
  }
}
