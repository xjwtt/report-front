import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async userMenuTree (context, payload) {
      return ajax.get('/system/userMenuTree.action')
    },
    async gridMenu (context, payload) {
      return ajax.post('/system/gridMenu.action', payload.data)
    },
    async deleteMenu (context, payload) {
      return ajax.post('/system/deleteMenu.action', payload.data)
    },
    async selecMenutById (context, payload) {
      return ajax.post('/system/selecMenutById.action', payload.data)
    },
    async saveOrUpdateMenu (context, payload) {
      return ajax.post('/system/saveOrUpdateMenu.action', payload.data)
    }
  }
}
