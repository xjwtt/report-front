import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async selectCategoryByKeyName (context, payload) {
      return ajax.post('/system/selectCategoryByKeyName.action', payload.data)
    },
    async categoryTree (context, payload) {
      return ajax.post('/system/CategoryTree.action', payload.data)
    },
    async gridCategory (context, payload) {
      return ajax.post('/system/gridCategory.action', payload.data)
    },
    async deleteCategory (context, payload) {
      return ajax.post('/system/deleteCategory.action', payload.data)
    },
    async selectCategoryById (context, payload) {
      return ajax.post('/system/selectCategoryById.action', payload.data)
    },
    async saveOrUpdateCategory (context, payload) {
      return ajax.post('/system/saveOrUpdateCategory.action', payload.data)
    }
  }
}
