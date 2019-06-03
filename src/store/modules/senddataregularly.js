import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async gridSendRegularly (context, payload) {
      return ajax.post('/system/gridSendRegularly.action', payload.data)
    },
    async saveOrUpdateSendRegularly (context, payload) {
      return ajax.post('/system/saveOrUpdateSendRegularly.action', payload.data)
    },
    async saveSendRegularlyMalls (context, payload) {
      return ajax.post('/system/saveSendRegularlyMalls.action', payload.data)
    },
    async delSendRegularly (context, payload) {
      return ajax.post('/system/delSendRegularly.action', payload.data)
    }
  }
}
