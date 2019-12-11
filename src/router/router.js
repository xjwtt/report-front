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
  passby_traffic: () => import('@/views/passby_traffic'),
  tag_traffic: () => import('@/views/tag_traffic'),
  site_location_compare: () => import('@/views/site_location_compare'),
  sites_location_compare: () => import('@/views/sites_location_compare'),
  tags_location_compare: () => import('@/views/tags_location_compare'),
  site_time_compare: () => import('@/views/site_time_compare'),
  // entrance_traffic: () => import('@/views/entrance_traffic')
  company_manager: () => import('@/views/company_manager'),
  menu_manager: () => import('@/views/menu_manager'),
  role_manager: () => import('@/views/role_manager'),
  user_manager: () => import('@/views/user_manager'),
  mall_manager: () => import('@/views/mall_manager'),
  location_manager: () => import('@/views/location_manager'),
  camera_manager: () => import('@/views/camera_manager'),
  camerastatus_manager: () => import('@/views/camerastatus_manager'),
  device_manager: () => import('@/views/device_manager'),
  devicestatus_manager: () => import('@/views/devicestatus_manager'),
  cameraZone_manager: () => import('@/views/cameraZone_manager'),
  physical_manager: () => import('@/views/physical_manager'),
  physicalZone_manager: () => import('@/views/physicalZone_manager'),
  tagtype_manager: () => import('@/views/tagtype_manager'),
  tagtype_grid: () => import('@/views/tagtype_grid'),
  businesstime_manager: () => import('@/views/businesstime_manager'),
  businesstime_grid: () => import('@/views/businesstime_grid'),
  weather_manager: () => import('@/views/weather_manager'),
  recover_manager: () => import('@/views/recover_manager'),
  historyflow_manager: () => import('@/views/historyflow_manager'),
  copydata_manager: () => import('@/views/copydata_manager'),
  task_manager: () => import('@/views/task_manager'),
  site_peak_time: () => import('@/views/site_peak_time'),
  zone_peak_time: () => import('@/views/zone_peak_time'),
  prediction_analysis: () => import('@/views/prediction_analysis'),
  weather_analysis: () => import('@/views/weather_analysis'),
  show_case_analysis: () => import('@/views/show_case_analysis'),
  send_data_regularly: () => import('@/views/send_data_regularly'),
  zone_face_analysis: () => import('@/views/zone_face_analysis'),
  category_manager: () => import('@/views/category_manager'),
  face_grid: () => import('@/views/face_grid'),
  face_match_grid: () => import('@/views/face_match_grid'),
  eas_device_alarm_analysis: () => import('@/views/eas_device_alarm_analysis'),
  face_alarm_manage: () => import('@/views/face_alarm_manage'),
  face_alarm_record: () => import('@/views/face_alarm_record'),
  export_table: () => import('@/views/export_table')
}
