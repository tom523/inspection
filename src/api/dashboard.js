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

// 消息
export function getUnreadCount() {
  return request({
    url: '/inspection-log/point-log/get_unread_count/',
    method: 'get'
  })
}

// 清空消息
export function putSetHasRead() {
  return request({
    url: '/inspection-log/point-log/set_has_read/',
    method: 'put'
  })
}
