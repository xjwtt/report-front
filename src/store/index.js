import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import report from './modules/report'
import widget from './modules/widget'
import company from './modules/company'
import menu from './modules/menu'
import role from './modules/role'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    app,
    report,
    widget,
    company,
    menu,
    role
  }
})

export default store
