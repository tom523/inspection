import request from '@/utils/request'

// 导入巡检数据
export function importInspectionData(data) {
  return request({
    url: '/inspection/import_inspection_data/',
    method: 'post',
    data
  })
}

// 获取巡检数据
export function getPoint(params) {
  return request({
    url: '/inspection/point/',
    method: 'get',
    params
  })
}

// 获取单个巡检数据
export function getSinglePoint(id) {
  return request({
    url: 'inspection/point/' + id + '/',
    method: 'get'
  })
}

// 添加巡检点数据
export function addPoint(data) {
  return request({
    url: '/inspection/point/',
    method: 'post',
    data
  })
}

// 更新巡检点数据
export function updatePoint(id, data) {
  return request({
    url: '/inspection/point/' + id + '/',
    method: 'put',
    data
  })
}

// 删除巡检点数据
export function deletePoint(id) {
  return request({
    url: '/inspection/point/' + id + '/',
    method: 'delete'
  })
}

// 获取轮次
export function getTurn(params) {
  return request({
    url: '/inspection/turn/',
    method: 'get',
    params
  })
}

// 获取所有轮次
export function getAllTurn() {
  return request({
    url: '/inspection/turn/get_choices/',
    mehtod: 'get'
  })
}

// 更新轮次
export function updateTurn(id, data) {
  return request({
    url: '/inspection/turn/' + id + '/',
    method: 'put',
    data
  })
}

// 添加轮次
export function addTurn(data) {
  return request({
    url: '/inspection/turn/',
    method: 'post',
    data
  })
}

// 删除轮次
export function deleteTurn(id) {
  return request({
    url: '/inspection/turn/' + id + '/',
    method: 'delete'
  })
}

// 获取巡检项数据
export function getItem(params) {
  return request({
    url: '/inspection/item/',
    method: 'get',
    params
  })
}

// 添加巡检项数据
export function addItem(data) {
  return request({
    url: '/inspection/item/',
    method: 'post',
    data
  })
}

// 更新巡检项数据
export function updateItem(id, data) {
  return request({
    url: '/inspection/item/' + id + '/',
    method: 'put',
    data
  })
}

// 删除巡检项数据
export function deleteItem(id) {
  return request({
    url: '/inspection/item/' + id + '/',
    method: 'delete'
  })
}

// 获取设备
export function getDevice(params) {
  return request({
    url: '/inspection/device/',
    method: 'get',
    params
  })
}

// 添加设备
export function addDevice(data) {
  return request({
    url: '/inspection/device/',
    method: 'post',
    data
  })
}

// 更新设备
export function updateDevice(id, data) {
  return request({
    url: '/inspection/device/' + id + '/',
    method: 'put',
    data
  })
}

// 删除设备
export function deleteDevice(id) {
  return request({
    url: '/inspection/device/' + id + '/',
    method: 'delete'
  })
}

// 获取班中检查
export function getDutyCheck(params) {
  return request({
    url: '/inspection/duty-check/',
    method: 'get',
    params
  })
}

// 添加班中检查
export function addDutyCheck(data) {
  return request({
    url: '/inspection/duty-check/',
    method: 'post',
    data
  })
}

// 更新班中检查
export function updateDutyCheck(id, data) {
  return request({
    url: '/inspection/duty-check/' + id + '/',
    method: 'put',
    data
  })
}

// 删除班中检查
export function deleteDutyCheck(id) {
  return request({
    url: '/inspection/duty-check/' + id + '/',
    method: 'delete'
  })
}

// 获取班中检查项
export function getDutyCheckItem(params) {
  return request({
    url: '/inspection/duty-check-item/',
    method: 'get',
    params
  })
}

// 添加班中检查项
export function addDutyCheckItem(data) {
  return request({
    url: '/inspection/duty-check-item/',
    method: 'post',
    data
  })
}

// 更新班中检查项
export function updateDutyCheckItem(id, data) {
  return request({
    url: '/inspection/duty-check-item/' + id + '/',
    method: 'put',
    data
  })
}

// 删除班中检查项
export function deleteDutyCheckItem(id) {
  return request({
    url: '/inspection/duty-check-item/' + id + '/',
    method: 'delete'
  })
}

// 获取所有巡检点，不分页
export function getAllPoint() {
  return request({
    url: '/inspection/point/get_all_point_choices/',
    method: 'get'
  })
}

// 获取所有普通专业巡检点
export function getTurnChoices(argument) {
  return request({
    url: '/inspection/point/get_profession_point_choices/',
    method: 'get'
  })
}

// 获取所有设备，不分页
export function getAllDevice() {
  return request({
    url: '/inspection/device/get_choices/',
    method: 'get'
  })
}

// 获取巡检项记录
export function getItemLog(params) {
  return request({
    url: '/inspection-log/item-log/',
    method: 'get',
    params
  })
}

// 获取轮次记录
export function getTurnLog(params) {
  return request({
    url: '/inspection-log/turn-log/',
    mehtod: 'get',
    params
  })
}

// 获取巡检点记录
export function getPointLog(params) {
  return request({
    url: '/inspection-log/point-log/',
    method: 'get',
    params
  })
}
