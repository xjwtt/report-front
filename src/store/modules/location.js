import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async parentIdLocation (context, payload) {
      return ajax.post('/system/parentIdLocation.action', payload.data)
    },
    async locationTree (context, payload) {
      return ajax.post('/system/locationTree.action', payload.data)
    },
    async gridLocation (context, payload) {
      return ajax.post('/system/gridLocation.action', payload.data)
    },
    async selectLocationById (context, payload) {
      return ajax.post('/system/selectLocationById.action', payload.data)
    },
    async saveOrUpdateLocation (context, payload) {
      return ajax.post('/system/saveOrUpdateLocation.action', payload.data)
    },
    async deleteLocation (context, payload) {
      return ajax.post('/system/deleteLocation.action', payload.data)
    },
    async findHefengLocation (context, payload) {
      return ajax.post('system/findHefengLocation.action', payload.data)
    }
  }
}
