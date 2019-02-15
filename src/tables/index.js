import Vue from 'vue'
import Datatable from 'vue2-datatable-component'
import tdI18n from './tableFields/td-i18n'
import thFilter from './tableFields/th-Filter'
import tdOpt from './tableFields/td-Opt'
import tdStatus from './tableFields/td-status'

Vue.use(Datatable)
Vue.prototype.$i18nForDatatable = Vue.prototype.$t
Vue.component('td-i18n', tdI18n)
Vue.component('th-filter', thFilter)
Vue.component('td-opt', tdOpt)
Vue.component('td-status', tdStatus)
