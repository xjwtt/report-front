import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async gridTagType (context, payload) {
      return ajax.post('/business/gridTagType.action', payload.data)
    },
    async saveOrUpdateTagType (context, payload) {
      return ajax.post('/business/saveOrUpdateTagType.action', payload.data)
    },
    async deleteTagType (context, payload) {
      return ajax.post('/business/deleteTagType.action', payload.data)
    },
    async tagTypeSaveMalls (context, payload) {
      return ajax.post('/business/tagTypeSaveMalls.action', payload.data)
    },
    async gridMallTagType (context, payload) {
      return ajax.post('/business/gridMallTagType.action', payload.data)
    },
    async deleteTagTypeById_MallId (context, payload) {
      return ajax.post('/business/deleteTagTypeById_MallId.action', payload.data)
    },
    async selectTagTypeByCompanyId (context, payload) {
      return ajax.post('/business/selectTagTypeByCompanyId.action', payload.data)
    },
    async saveTagTypeMall (context, payload) {
      return ajax.post('/business/saveTagTypeMall.action', payload.data)
    }
  }
}
