import request from '@/utils/request'

// 首页四个按钮
export function getDashboardFourCount(argument) {
  return request({
    url: '/inspection-log/point-log/get_dashboard_four_count/',
    method: 'get'
  })
}

// 图表数据
export function getDashboardCount() {
  return request({
    url: '/inspection-log/point-log/get_dashboard_count/',
    method: 'get'
  })
}

