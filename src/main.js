// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ECharts from 'vue-echarts'

import 'vue-easytable/libs/themes-base/index.css'
import {VTable, VPagination} from 'vue-easytable'

import App from './App'
import {router} from './router/index'
import i18n from './i18n'
import store from './store'
import './tables'

import IntervalPicker from './components/IntervalPicker'
import IntervalPickerHourlyweek from './components/IntervalPickerHourlyweek'
import IntervalPickerDayWMY from './components/IntervalPickerDayWMY'
import DateRangePicker from './components/DateRangePicker'
import DateRangePickerAndLastYear from './components/DateRangePickerAndLastYear'
import DateRange from './components/DateRange'
import DateWeekRangePicker from './components/DateWeekRangePicker'
import SingleMallSelect from './components/SingleMallSelect'
import CompareMallSelect from './components/CompareMallSelect'
import TheTable from './components/TheTable'
import TrafficeTable from './components/TrafficeTable'
import TrafficeTalbeCompareFast from './components/TrafficeTalbeCompareFast'
import TrafficeBigdataTable from './components/TrafficeBigdataTable'
import BaseBigdataTable from './components/BaseBigdataTable'
import ZoneSelector from './components/ZoneSelector'
import DeviceSelector from './components/DeviceSelector'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.component('chart', ECharts)

Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)

Vue.component('interval-picker', IntervalPicker)
Vue.component('interval-picker-hourlyweek', IntervalPickerHourlyweek)
Vue.component('interval-picker-day-w-m-y', IntervalPickerDayWMY)
Vue.component('date-range-picker', DateRangePicker)
Vue.component('date-range-picker-and-last-year', DateRangePickerAndLastYear)
Vue.component('date-range', DateRange)
Vue.component('date-week-range-picker', DateWeekRangePicker)
Vue.component('single-mall-select', SingleMallSelect)
Vue.component('compare-mall-select', CompareMallSelect)
Vue.component('the-table', TheTable)
Vue.component('traffice-table', TrafficeTable)
Vue.component('traffice-table-compare-fast', TrafficeTalbeCompareFast)
Vue.component('traffice-bigdata-table', TrafficeBigdataTable)
Vue.component('base-bigdata-table', BaseBigdataTable)
Vue.component('zone-selector', ZoneSelector)
Vue.component('device-selector', DeviceSelector)

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
