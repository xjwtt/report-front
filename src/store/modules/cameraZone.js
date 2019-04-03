import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async CameraZoneByCameraId (context, payload) {
      return ajax.post('/business/CameraZoneByCameraId.action', payload.data)
    },
    async gridCameraZoneMd (context, payload) {
      return ajax.post('/business/gridCameraZoneMd.action', payload.data)
    },
    async saveOrUpdateCameraZone (context, payload) {
      return ajax.post('/business/saveOrUpdateCameraZone.action', payload.data)
    },
    async deleteCameraZone (context, payload) {
      return ajax.post('/business/deleteCameraZone.action', payload.data)
    },
    async selectCameraZoneCamera (context, payload) {
      return ajax.post('/business/selectCameraZoneCamera.action', payload.data)
    },
    async selectCameraZoneByMallIdZoneClass (context, payload) {
      return ajax.post('/business/selectCameraZoneByMallId_ZoneClass.action', payload.data)
    }
  }
}
