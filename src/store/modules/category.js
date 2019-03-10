import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async selectCategoryByKeyName (context, payload) {
      return ajax.post('/system/selectCategoryByKeyName.action', payload.data)
    }
  }
}
