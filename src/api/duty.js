import request from '@/utils/request'

// 获取排班设置
export function getDutyLogConfig(params) {
  return request({
    url: '/duty-log/duty-log-config/',
    method: 'get',
    params
  })
}

// 添加排班设置
export function addDutyLogConfig(data) {
  return request({
    url: '/duty-log/duty-log-config/',
    method: 'post',
    data
  })
}

// 更新排班设置
export function updateDutyLogConfig(id, data) {
  return request({
    url: '/duty-log/duty-log-config/' + id + '/',
    method: 'put',
    data
  })
}

// 删除排班设置
export function deleteDutyLogConfig(id) {
  return request({
    url: '/duty-log/duty-log-config/' + id + '/',
    method: 'delete'
  })
}

// 获取排班记录
export function getDutyLog(params) {
  return request({
    url: '/duty-log/duty-log/',
    method: 'get',
    params
  })
}

// 添加排班记录
export function addDutyLog(data) {
  return request({
    url: '/duty-log/duty-log/',
    method: 'post',
    data
  })
}

// 更新排班记录
export function updateDutyLog(id, data) {
  return request({
    url: '/duty-log/duty-log/' + id + '/',
    method: 'put',
    data
  })
}

// 删除排班记录
export function deleteDutyLog(id) {
  return request({
    url: '/duty-log/duty-log/' + id + '/',
    method: 'delete'
  })
}

// 获取整套值
export function getTeamSet() {
  return request({
    url: '/role/users/extra/get_teams_set/',
    method: 'get'
  })
}

// 获取排班运转方式
export function getDutyLogOperationWay() {
  return request({
    url: '/duty-log/operation-way/',
    method: 'get'
  })
}

// 新建排班运转方式
export function addDutyLogOperationWay(data) {
  return request({
    url: '/duty-log/operation-way/',
    method: 'post',
    data
  })
}
