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
export function getPoint() {
  return request({
    url: '/inspection/point/',
    method: 'get'
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
