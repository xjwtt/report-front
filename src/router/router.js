export const routes = {
  routes: [
    {
      path: '/',
      redirect: 'real_time_report'
    },
    {
      path: '*',
      name: 'error',
      component: () => import('../views/404')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login')
    }
  ]
}

export const allRouters = {
  real_time_report: () => import('@/views/real_time_report'),
  widget_manager: () => import('@/views/widget_manager'),
  site_traffic: () => import('@/views/site_traffic'),
  store_report: () => import('@/views/store_report'),
  // entrance_traffic: () => import('@/views/entrance_traffic')
  company_manager: () => import('@/views/company_manager'),
  menu_manager: () => import('@/views/menu_manager'),
  role_manager: () => import('@/views/role_manager')
}
