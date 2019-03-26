import ajax from '@/lib/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async weatherGrid (context, payload) {
      return ajax.post('/system/weatherGrid.action', payload.data)
    },
    async getTodayWeather (context, payload) {
      return ajax.get('/system/getTodayWeather.action')
    }
  }
}
