import request from '@/utils/request'

// 导入巡检数据
export function getStatisticData() {
  return request({
    url: '/inspection-log/turn-log/statistic_time_consumed/',
    method: 'get'
  })
}