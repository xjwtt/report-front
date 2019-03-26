// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import ECharts from 'vue-echarts'

import 'vue-easytable/libs/themes-base/index.css'
import {VTable, VPagination} from 'vue-easytable'
import 'canvas-datagrid'

import App from './App'
import {router} from './router/index'
import i18n from './i18n'
import store from './store'
import './tables'

import IntervalPicker from './components/IntervalPicker'
import DateRangePicker from './components/DateRangePicker'
import SingelMallSelect from './components/SingelMallSelect'
import CompareMallSelect from './components/CompareMallSelect'
import TheTable from './components/TheTable'
import TrafficeTable from './components/TrafficeTable'
import TrafficeTable02 from './components/TrafficeTable02'
import ZoneSelector from './components/ZoneSelector'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.component('chart', ECharts)
Vue.config.ignoredElements = ['canvas-datagrid']

Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)

Vue.component('interval-picker', IntervalPicker)
Vue.component('date-range-picker', DateRangePicker)
Vue.component('singel-mall-select', SingelMallSelect)
Vue.component('compare-mall-select', CompareMallSelect)
Vue.component('the-table', TheTable)
Vue.component('traffice-table', TrafficeTable)
Vue.component('traffice-table02', TrafficeTable02)
Vue.component('zone-selector', ZoneSelector)

let asyncMain = async () => {
  await store.dispatch('app/getUserInfo')
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    i18n,
    store,
    components: {App},
    template: '<App/>'
  })
}
asyncMain()
