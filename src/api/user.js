import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/account/login/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/account/get_user_info/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/account/logout/',
    method: 'post'
  })
}

// 获取角色
export function getRoleUser(params) {
  return request({
    url: '/role/users/',
    method: 'get',
    params
  })
}

// 添加角色
export function addRoleUser(data) {
  return request({
    url: '/role/users/',
    method: 'post',
    data
  })
}

// 更新角色
export function updataRoleUser(id, data) {
  return request({
    url: '/role/users/' + id + '/',
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRoleUser(id) {
  return request({
    url: '/role/users/' + id + '/',
    method: 'delete'
  })
}

// 获取所有用户
export function getAllUser() {
  return request({
    url: '/account/user/get_choices/',
    method: 'get'
  })
}
// 获取用户
export function getAccountUser(params) {
  return request({
    url: '/account/user/',
    method: 'get',
    params
  })
}

// 创建用户
export function addAccountUser(data) {
  return request({
    url: '/account/user/create_user/',
    method: 'post',
    data
  })
}

// 更新用户
export function updataAccountUser(id, data) {
  return request({
    url: '/account/user/' + id + '/',
    method: 'put',
    data
  })
}

// 删除用户
export function deleteAccoutUser(id) {
  return request({
    url: '/account/user/' + id + '/',
    method: 'delete'
  })
}

// 修改密码
export function modifyPassword(id, data) {
  return request({
    url: '/account/user/' + id + '/modify_password/',
    method: 'post',
    data
  })
}

// 调人记录
export function getTransferLog() {
  return request({
    url: '/role/transfer/',
    method: 'get'
  })
}

// 获取所有巡检项类型
export function getGlobalChoices() {
  return request({
    url: '/account/get_global_choices/',
    method: 'get'
  })
}

// 值管理，获取用户
export function getTeamNotSelectedChoices() {
  return request({
    url: '/account/user/get_team_not_selected_choices/',
    method: 'get'
  })
}
