import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async userDeviceGrid (context, payload) {
      return ajax.post('/business/userDeviceGrid.action', payload.data)
    },
    async saveOrUpdateDevice (context, payload) {
      return ajax.post('/business/saveOrUpdateDevice.action', payload.data)
    },
    async delDevice (context, payload) {
      return ajax.post('/business/delDevice.action', payload.data)
    },
    async userDeviceStatus (context, payload) {
      return ajax.post('/business/userDeviceStatus.action', payload.data)
    }
  }
}
