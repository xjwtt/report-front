import axios from 'axios'
import Vue from 'vue'
import i18n from '@/i18n'
import {router} from '@/router/index'

const t = key => i18n.t(key)

const ajax = axios.create({
  timeout: 10000
})
ajax.interceptors.request.use(
  function (config) {
    if (!config.skipInterceptors) {
      config.loading = Vue.prototype.$loading({fullscreen: true})
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

ajax.interceptors.response.use(
  respon => {
    if (respon.config.loading) {
      respon.config.loading.close()
    }
    let code = respon.data.status
    if (code === 1000) {
      return respon.data.data
    } else {
      if (code === 1009) {
        if (router.app && router.app.$route.name !== 'login') {
          Vue.prototype.$alert(t(respon.data.showText), '', {
            confirmButtonText: t('go_to_login'),
            callback: action => {
              location.reload()
            }
          })
        }
      } else {
        Vue.prototype.$notify({
          title: 'error',
          message: t(respon.data.showText),
          type: 'error'
        })
      }
      return Promise.reject(respon)
    }
  },
  error => {
    if (error.response.config.loading) {
      error.response.config.loading.close()
    }
    Vue.prototype.$notify({
      title: error.response.status,
      message: error.response.statusText,
      type: 'error'
    })
  }
)
export default ajax
