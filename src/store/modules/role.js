import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async gridRole (context, payload) {
      return ajax.post('/system/gridRole.action', payload.data)
    },
    async saveOrUpdateRole (context, payload) {
      return ajax.post('/system/saveOrUpdateRole.action', payload.data)
    },
    async deleteRole (context, payload) {
      return ajax.post('/system/delRole.action', payload.data)
    },
    async roleMenu (context, payload) {
      return ajax.post('/system/roleMenu.action', payload.data)
    },
    async selectRole (context, payload) {
      return ajax.post('/system/selectRole.action')
    }
  }
}
