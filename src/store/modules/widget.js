import ajax from '@/lib/ajax'
import _ from 'underscore'
export default {
  namespaced: true,
  state: {
    userWidgets: []
  },
  mutations: {
    setUserWidgets (state, payload) {
      payload.forEach(widget => {
        if (!widget.i) {
          widget.i = widget.Id.toString()
        }
        if (!widget.x & !widget.y || !widget.w || !widget.h) {
          widget.x = widget.x ? widget.x : 0
          widget.y = widget.y ? widget.y : 0
          widget.w = widget.w ? widget.w : widget.minW
          widget.h = widget.h ? widget.h : widget.minH
        }
      })
      state.userWidgets = payload
    }
  },
  actions: {
    async getUnUsedWidget (context) {
      let res = await ajax.post('system/PageWidgetManager.html?op=select', {
        IsMobile: -1
      })
      let Ids = _.map(context.state.userWidgets, element => element.Id)
      return _.reject(res, element => _.contains(Ids, element.Id))
    },
    async resetUserWidget (context) {
      let res = await ajax.post('system/PageWidgetManager.html?op=select', {
        IsMobile: -1
      })

      console.log(res)
      context.commit('setUserWidgets', res)
    },
    async getUserWidget (context) {
      let res = await ajax.post('system/UserManager.html?op=getUserWidget')
      context.commit('setUserWidgets', res)
    },
    async saveUserWidget (context) {
      let res = _.map(context.state.userWidgets, element => {
        return {
          Id: element.Id,
          x: element.x,
          y: element.y,
          h: element.h,
          w: element.w,
          Options: {}
        }
      })
      await ajax.post('/system/UserManager.html?op=saveUserWidget', {
        PageWidgets: res
      })
    },
    async getAllWidget (context, payload) {
      return ajax.post('system/PageWidgetManager.html?op=grid', payload.data)
    },
    async delWidgets (context, payload) {
      return ajax.post('system/PageWidgetManager.html?op=del', {
        Ids: payload.data
      })
    },
    async addEditWidget (context, payload) {
      return ajax.post('system/PageWidgetManager.html?op=save', payload.data)
    }
  }
}
