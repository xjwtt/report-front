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
  zone_traffic: () => import('@/views/zone_traffic'),
  // entrance_traffic: () => import('@/views/entrance_traffic')
  company_manager: () => import('@/views/company_manager'),
  menu_manager: () => import('@/views/menu_manager'),
  role_manager: () => import('@/views/role_manager'),
  user_manager: () => import('@/views/user_manager'),
  mall_manager: () => import('@/views/mall_manager'),
  location_manager: () => import('@/views/location_manager'),
  camera_manager: () => import('@/views/camera_manager'),
  camerastatus_manager: () => import('@/views/camerastatus_manager'),
  cameraZone_manager: () => import('@/views/cameraZone_manager'),
  physical_manager: () => import('@/views/physical_manager'),
  physicalZone_manager: () => import('@/views/physicalZone_manager'),
  businesstime_manager: () => import('@/views/businesstime_manager')
}
