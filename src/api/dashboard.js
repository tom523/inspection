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

// 最近五个班次
export function getRecentDutyLog(params) {
  return request({
    url: '/duty-log/duty-log/',
    method: 'get',
    params
  })
}

// 轮次状态统计
export function getDayTurnCount() {
  return request({
    url: '/inspection-log/turn-log/get_day_turn_count/',
    method: 'get'
  })
}
