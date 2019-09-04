import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async gridSendRegularly (context, payload) {
      return ajax.post('/system/gridSendRegularly.action', payload.data)
    },
    async gridSendRegularlyLogs (context, payload) {
      return ajax.post('/system/gridSendRegularlyLogs.action', payload.data)
    },
    async saveOrUpdateSendRegularly (context, payload) {
      return ajax.post('/system/saveOrUpdateSendRegularly.action', payload.data)
    },
    async saveSendRegularlyMalls (context, payload) {
      return ajax.post('/system/saveSendRegularlyMalls.action', payload.data)
    },
    async delSendRegularly (context, payload) {
      return ajax.post('/system/delSendRegularly.action', payload.data)
    },
    async uploadByLog (context, payload) {
      return ajax.post('/system/uploadBySendRegulaylyLog.action', payload.data)
    },
    async uploadByTime (context, payload) {
      return ajax.post('/system/uploadBySendRegulaylyIdAndTime.action', payload.data)
    }
  }
}
