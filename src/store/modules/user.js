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
    async unlock (context, payload) {
      return ajax.post('/system/unlock.action', payload.data)
    },
    async resetPassword (context, payload) {
      return ajax.post('/system/resetPassword.action', payload.data)
    },
    async selectUserByParentId (context, payload) {
      return ajax.post('/system/selectUserByParentId.action', payload.data)
    },
    async roleMenu (context, payload) {
      return ajax.post('/system/roleMenu.action', payload.data)
    },
    async saveMalls (context, payload) {
      return ajax.post('/system/saveUserMalls.action', payload.data)
    }
  }
}
