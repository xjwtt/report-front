import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import report from './modules/report'
import widget from './modules/widget'
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
    widget
  }
})

export default store
