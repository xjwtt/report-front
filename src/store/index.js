import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import report from './modules/report'
import hourlyweek from './modules/hourlyweek'
import widget from './modules/widget'
import zone from './modules/zone'
import company from './modules/company'
import menu from './modules/menu'
import role from './modules/role'
import user from './modules/user'
import mall from './modules/mall'
import location from './modules/location'
import camera from './modules/camera'
import cameraZone from './modules/cameraZone'
import physical from './modules/physical'
import category from './modules/category'
import zonecamera from './modules/zonecamera'
import businesstime from './modules/businesstime'
import weather from './modules/weather'
import recover from './modules/recover'
import history from './modules/historyflow'
import task from './modules/task'
import senddataregularly from './modules/senddataregularly'

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
    hourlyweek,
    widget,
    zone,
    company,
    menu,
    role,
    user,
    mall,
    location,
    camera,
    cameraZone,
    physical,
    category,
    zonecamera,
    businesstime,
    weather,
    recover,
    history,
    task,
    senddataregularly
  }
})

export default store
