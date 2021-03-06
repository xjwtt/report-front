import Vue from 'vue'
import Datatable from 'vue2-datatable-component'
import tdI18n from './tableFields/td-i18n'
import thI18n from './tableFields/th-i18n'
import thFilter from './tableFields/th-Filter'
import tdOpt from './tableFields/td-Opt'
import tdStatus from './tableFields/td-status'
import tdLock from './tableFields/td-lock'
import tdBusinesstimeOpt from './tableFields/td-businesstimeOpt'
import tdUserOpt from './tableFields/td-userOpt'
import tdGetWeather from './tableFields/td-getWeather'
import tdCameraStatus from './tableFields/td-cameraStatus'
import tdMoveopt from './tableFields/td-moveopt'
import tdReverse from './tableFields/td-reverse'
import tdTaskStatus from './tableFields/td-taskStatus'
import tdTaskOpt from './tableFields/td-taskOpt'
import tdSendRegularlyOpt from './tableFields/td-sendRegularlyOpt'
import tdSendStatus from './tableFields/td-sendStatus'
import tdSendRegularlyLogOpt from './tableFields/td-sendRegularlyLogOpt'
import tdWeekdays from './tableFields/td-weekdays'
import tdGender from './tableFields/td-Gender'
import tdImage from './tableFields/td-Image'
import tdFaceMatchOpt from './tableFields/td-faceMatchOpt'

Vue.use(Datatable)
Vue.prototype.$i18nForDatatable = Vue.prototype.$t
Vue.component('td-i18n', tdI18n)
Vue.component('th-i18n', thI18n)
Vue.component('th-filter', thFilter)
Vue.component('td-opt', tdOpt)
Vue.component('td-status', tdStatus)
Vue.component('td-lock', tdLock)
Vue.component('td-businesstimeOpt', tdBusinesstimeOpt)
Vue.component('td-userOpt', tdUserOpt)
Vue.component('td-getWeather', tdGetWeather)
Vue.component('td-cameraStatus', tdCameraStatus)
Vue.component('td-moveopt', tdMoveopt)
Vue.component('td-reverse', tdReverse)
Vue.component('td-taskStatus', tdTaskStatus)
Vue.component('td-taskOpt', tdTaskOpt)
Vue.component('td-sendRegularlyOpt', tdSendRegularlyOpt)
Vue.component('td-sendStatus', tdSendStatus)
Vue.component('td-sendRegularlyLogOpt', tdSendRegularlyLogOpt)
Vue.component('td-weekdays', tdWeekdays)
Vue.component('td-gender', tdGender)
Vue.component('td-image', tdImage)
Vue.component('td-faceMatchOpt', tdFaceMatchOpt)
