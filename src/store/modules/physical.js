import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async gridPhysicalZone (context, payload) {
      return ajax.post('/business/gridPhysicalZone.action', payload.data)
    },
    async saveOrUpdatePhysical (context, payload) {
      return ajax.post('/business/saveOrUpdatePhysical.action', payload.data)
    },
    async deletPhysical (context, payload) {
      return ajax.post('/business/deletPhysical.action', payload.data)
    }
  }
}
