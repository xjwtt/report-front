import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async userMall (context, payload) {
      return ajax.post('/business/userMall.action', payload.data)
    },
    async sendRegularlyMall (context, payload) {
      return ajax.post('/business/sendRegularlyMall.action', payload.data)
    },
    async businessTimeMall (context, payload) {
      return ajax.post('/business/businessTimeMall.action', payload.data)
    },
    async tagTypeMall (context, payload) {
      return ajax.post('/business/tagTypeMall.action', payload.data)
    },
    async selectCompanyMall (context, payload) {
      return ajax.post('/business/selectCompanyMall.action', payload.data)
    },
    async gridMall (context, payload) {
      return ajax.post('/business/gridMall.action', payload.data)
    },
    async saveOrUpdateMall (context, payload) {
      return ajax.post('/business/saveOrUpdateMall.action', payload.data)
    },
    async delMall (context, payload) {
      return ajax.post('/business/delMall.action', payload.data)
    },
    async selectCompanyMallByMallid (context, payload) {
      return ajax.post('/business/selectCompanyMallByMallid.action', payload.data)
    }
  }
}
