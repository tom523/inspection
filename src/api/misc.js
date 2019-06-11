import request from '@/utils/request'

// 导入巡检数据
export function getStatisticData() {
  return request({
    url: '/inspection-log/turn-log/statistic_time_consumed/',
    method: 'get'
  })
}

// 数据统计过滤条件
export function getRelatedTurnProfession() {
  return request({
    url: '/inspection/turn/get_related_turn_profession/',
    method: 'get'
  })
}

// 按人统计
export function getStaffTimeConsumed(params) {
  return request({
    url: '/inspection-log/turn-log/staff_time_consumed/',
    method: 'get',
    params
  })
}

// 按轮次统计
export function getTurnLogTimeConsumed(params) {
  return request({
    url: '/inspection-log/turn-log/turn_log_time_consumed/',
    method: 'get',
    params
  })
}

// 按班次统计
export function getDutyLogTimeConsumed(params) {
  return request({
    url: '/inspection-log/turn-log/duty_log_time_consumed/',
    method: 'get',
    params
  })
}
