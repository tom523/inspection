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
    url: '/duty-log/duty-log/get_team_desc_duty_log/',
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
export function getTeamSet(params) {
  return request({
    url: '/role/users/extra/get_teams_set/',
    method: 'get',
    params
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

// 更新排班运转方式
export function updateDutyLogOperationWay(id, data) {
  return request({
    url: '/duty-log/operation-way/' + id + '/',
    method: 'put',
    data
  })
}

// 删除排班运转方式
export function deleteDutyLogOperationWay(id) {
  return request({
    url: '/duty-log/operation-way/' + id + '/',
    method: 'delete'
  })
}

// 生成复检,管线巡检记录
export function genLogByFrequencyREviewAndPipe(data) {
  return request({
    url: '/inspection-log/turn-log/create_log_for_frequency/',
    method: 'post',
    data
  })
}

// // 生成管线巡检记录
// export function genLogByFrequencyPipe(data) {
//   return request({
//     url: 'inspection-log/turn-log/create_log_for_frequency_pipe/',
//     method: 'post',
//     data
//   })
// }

// 获取班中检查
export function dutyCheckGetChoices() {
  return request({
    url: '/inspection/duty-check/get_choices/',
    method: 'get'
  })
}

// 生成单个排班记录

export function createInspectionLogByDutyLog(data) {
  return request({
    url: '/inspection-log/turn-log/create_inspection_log_by_duty_log/',
    method: 'post',
    data
  })
}

// 交接班记录
export function gettakeoverLog(params) {
  return request({
    url: '/duty-log/take-over-log/get_queryset_by_professions/',
    method: 'get',
    params
  })
}

// 交接班记录选项
export function getTeamProfessionChoices() {
  return request({
    url: '/role/users/extra/team_profession_choices/',
    method: 'get'
  })
}
