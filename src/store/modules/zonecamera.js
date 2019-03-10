// import _ from 'underscore'
// import moment from 'moment'
import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getCameraZone (context, payload) {
      return ajax.post('/business/getCameraZone.action', payload.data)
    },
    async connectByPhysical (context, payload) {
      return ajax.post('/business/connectByPhysical.action', payload.data)
    },
    async getPhysicalByCamera (context, payload) {
      return ajax.post('/business/getPhysicalByCamera.action', payload.data)
    },
    async connectByCamera (context, payload) {
      return ajax.post('/business/connectByCamera.action', payload.data)
    }
  }
}
