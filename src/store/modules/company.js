import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getAllCompany (context, payload) {
      return ajax.post('/business/gridCompany.action', payload.data)
    },
    async saveOrUpdateCompany (context, payload) {
      return ajax.post('/business/saveOrUpdateCompany.action', payload.data)
    },
    async deleteCompany (context, payload) {
      return ajax.post('/business/deleteCompany.action', payload.data)
    }
  }
}
