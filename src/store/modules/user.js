import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async gridUser (context, payload) {
      return ajax.post('/system/gridUser.action', payload.data)
    },
    async saveOrUpdateUser (context, payload) {
      return ajax.post('/system/saveOrUpdateUser.action', payload.data)
    },
    async deleteUser (context, payload) {
      return ajax.post('/system/delUser.action', payload.data)
    },
    async roleMenu (context, payload) {
      return ajax.post('/system/roleMenu.action', payload.data)
    },
    async saveMalls (context, payload) {
      return ajax.post('/system/saveUserMalls.action', payload.data)
    }
  }
}
