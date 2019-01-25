import Vue from 'vue'
import Datatable from 'vue2-datatable-component'
import tdI18n from './tableFields/td-i18n'
import thFilter from './tableFields/th-Filter'
import tdOpt from './tableFields/td-Opt'

Vue.use(Datatable)
Vue.component('td-i18n', tdI18n)
Vue.component('th-filter', thFilter)
Vue.component('td-opt', tdOpt)
