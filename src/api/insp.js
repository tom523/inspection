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
export function getTurn() {
  return request({
    url: '/inspection/turn',
    method: 'get'
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
