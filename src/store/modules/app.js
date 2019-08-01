import ajax from '@/lib/ajax'
import _ from 'underscore'
import {addRouterFromMenus} from '@/router/index'
import i18n from '../../i18n'
import appconst from '@/lib/appconst'
import language from '@/lib/language'
import moment from 'moment'

const t = key => i18n.t(key)
export default {
  namespaced: true,
  state: {
    isLogin: false,
    UserID: null,
    userName: null,
    language: null,
    email: null,
    telephone: null,
    malls: [],
    menus: [],
    tagTypes: [],

    companyID: null,
    companyName: null,
    companyTitile: '',
    companyLogoImg: '',

    selectedMall: null,
    selectedMalls: [],

    timeInterval: null,
    timeIntervals: null,
    hourlyWeek: null,
    hourlyWeeks: null,
    dayWMY: null,
    dayWMYS: null,
    weekMonthPickerOptions: null,
    dateRange: appconst.defaultDateRange,
    peakTimeDateRange: [moment().subtract(7, 'days'), moment().subtract(1, 'days')]
  },
  mutations: {
    setUserInfo (state, payload) {
      state.userName = payload.Name
      state.email = payload.Email
      state.telephone = payload.Telephone
      state.malls = payload.Malls
      state.tagTypes = payload.TagTypes
      state.selectedMall = payload.Malls[0]
      state.selectedMalls = payload.Malls
      state.menus = payload.Menus
      state.showLogo = payload.ShowLogo
      state.isLogin = true
      state.language = payload.Language
      if (payload.Language !== 'auto') {
        i18n.locale = payload.Language
      } else {
        i18n.locale = language.defaultLanguage
      }
      addRouterFromMenus(payload.Menus)
      state.timeInterval = appconst.defaultTimeInterval(t)
      state.timeIntervals = appconst.timeIntervals(t)
      state.hourlyWeek = appconst.defaultHourlyWeek(t)
      state.hourlyWeeks = appconst.hourlyWeeks(t)
      state.weekMonthPickerOptions = appconst.weekMonthPickerOptions(t)
      state.dayWMY = appconst.dayWMY(t)
      state.dayWMYS = appconst.dayWMYS(t)
    },
    setDayWMY (state, pahload) {
      state.dayWMY = _.find(state.dayWMYS, __ => __.key === pahload)
    },
    setHourlyWeek (state, payload) {
      state.hourlyWeek = _.find(state.hourlyWeeks, __ => __.key === payload)
    },
    setTimeInterval (state, payload) {
      state.timeInterval = _.find(state.timeIntervals, __ => __.key === payload)
    },
    setDateRange (state, payload) {
      state.dateRange = payload
    },
    setPeakTimeDateRange (state, payload) {
      state.peakTimeDateRange = payload
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
    },
    async loginOtherMsg (context, payload) {
      return ajax.post('loginOtherMsg.action', payload)
    }
  }
}
