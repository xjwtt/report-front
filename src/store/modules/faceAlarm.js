import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async gridFaceAlarm (context, payload) {
      return ajax.post('/system/gridFaceAlarm.action', payload.data)
    },
    async saveOrUpdateFaceAlarm (context, payload) {
      return ajax.post('/system/saveOrUpdateFaceAlarm.action', payload.data)
    },
    async deleteFaceAlarmByIds (context, payload) {
      return ajax.post('/system/deleteFaceAlarmByIds.action', payload.data)
    },
    async faceAlarmSaveDevices (context, payload) {
      return ajax.post('/system/faceAlarmSaveDevices.action', payload.data)
    },
    async getFaceDeviceAndFaceAlarmDevice (context, payload) {
      return ajax.post('/system/getFaceDeviceAndFaceAlarmDevice.action', payload.data)
    },
    async gridFaceAlarmRecord (context, payload) {
      return ajax.post('/system/gridFaceAlarmRecord.action', payload.data)
    },
    async getFaceDeviceByMallId (context, payload) {
      return ajax.post('/system/getFaceDeviceByMallId.action', payload.data)
    }
  }
}
