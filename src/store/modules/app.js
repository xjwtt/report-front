import ajax from '@/lib/ajax'
import _ from 'underscore'
import {addRouterFromMenus} from '@/router/index'
import appconst from '@/lib/appconst'
import i18n from '../../i18n'

export default {
  namespaced: true,
  state: {
    isLogin: false,
    UserID: null,
    userName: null,
    malls: [],
    menus: [],

    companyID: null,
    companyName: null,
    companyTitile: '',
    companyLogoImg: '',

    selectedMall: null,
    selectedMalls: [],

    timeInterval: appconst.defaultTimeInterval,
    timeIntervals: appconst.timeIntervals,

    dateRange: appconst.defaultDateRange
  },
  mutations: {
    setUserInfo (state, payload) {
      state.userName = payload.Name
      state.malls = payload.Malls
      state.selectedMall = payload.Malls[0]
      state.selectedMalls = payload.Malls
      state.menus = payload.Menus
      state.showLogo = payload.ShowLogo
      state.isLogin = true
      i18n.locale = payload.Language
      addRouterFromMenus(payload.Menus)
    },
    setTimeInterval (state, payload) {
      state.timeInterval = _.find(state.timeIntervals, __ => __.key === payload)
    },
    setDateRange (state, payload) {
      state.dateRange = payload
    },
    setSelectMall (state, payload) {
      state.selectedMall = _.find(state.selectedMalls, _ => _.Id === payload)
    },
    setSelectMalls (state, payload) {
      state.selectedMalls = _.filter(state.malls, __ =>
        _.contains(payload, __.Id)
      )
    }
  },
  actions: {
    async login (context, payload) {
      try {
        await ajax.post('/user/login.action', payload.data, {
          skipInterceptors: true
        })
        return true
      } catch (e) {
      }
      return false
    },
    async logout (context) {
      try {
        await ajax.post('/user/logout.action')
      } catch (e) {
        return
      }
      location.reload()
    },
    async getUserInfo (context) {
      try {
        let result = await ajax.get('system/userInfo.action', {
          skipInterceptors: true
        })
        context.commit('setUserInfo', result)
        context.commit('widget/setUserWidgets', result.PageWidget, {
          root: true
        })
      } catch (e) {
      }
    }
  }
}
