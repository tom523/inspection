import request from '@/utils/request'

// 获取图片
export function getPhoto(params) {
  return request({
    url: '/inspection-log/photo-log/',
    method: 'get',
    params
  })
}

// 点记录的所有状态统计
export function getDayPointCount() {
  return request({
    url: '/inspection-log/point-log/get_day_point_count/',
    method: 'get'
  })
}

// 设备记录的所有状态统计
export function getDayDeviceLogCount() {
  return request({
    url: '/inspection-log/device-log/get_day_device_log_count/',
    method: 'get'
  })
}

// 项记录的所有状态统计
export function getDayItemLogCount() {
  return request({
    url: '/inspection-log/item-log/get_day_item_log_count/',
    method: 'get'
  })
}

// 值下面所有专业的项
export function getDayTeamProfessionItemCount() {
  return request({
    url: '/inspection-log/item-log/get_day_team_profession_item_count/',
    method: 'get'
  })
}

// 值下面所有专业的设备
export function getDayTeamProfessionDeviceCount() {
  return request({
    url: '/inspection-log/device-log/get_day_team_profession_device_count/',
    method: 'get'
  })
}

// 获取当天所有班次
export function getTodayAllDutyLog() {
  return request({
    url: '/duty-log/duty-log/get_today_all_duty_log',
    method: 'get'
  })
}
