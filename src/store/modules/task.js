import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async gridTask (context, payload) {
      return ajax.post('/business/gridTask.action', payload.data)
    },
    async saveOrUpdateTask (context, payload) {
      return ajax.post('/business/saveOrUpdateTask.action', payload.data)
    },
    async deleteTask (context, payload) {
      return ajax.post('/business/deleteTask.action', payload.data)
    }
  }
}
