import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { allRouters, routes } from './router'
import Page from '../views/page'
Vue.use(Router)

export const router = new Router(routes)

router.beforeEach((to, from, next) => {
  if (!store.state.app.isLogin && to.name !== 'login') {
    next({
      name: 'login'
    })
  } else if (store.state.app.isLogin && to.name === 'login') {
    next({
      name: 'real_time_report'
    })
  } else {
    next()
  }
})
router.afterEach((to) => {
  window.scrollTo(0, 0)
})

export function addRouterFromMenus (menus) {
  let extendsRoutes = []
  let forFn = function (array) {
    for (let i = 0; i < array.length; i++) {
      let r = allRouters[array[i].Name]
      if (r) {
        extendsRoutes.push({
          path: '/' + array[i].Name,
          name: array[i].Name,
          component: r
        })
      }
      if (array[i].children.length > 0) {
        forFn(array[i].children)
      }
    }
  }
  forFn(menus)
  router.addRoutes([{
    path: '/',
    component: Page,
    children: extendsRoutes
  }])
}
