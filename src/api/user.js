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

export function getRoleUser(params) {
  return request({
    url: '/role/users/',
    method: 'get',
    params
  })
}

export function addRoleUser(data) {
  return request({
    url: '/role/users/',
    method: 'post',
    data
  })
}

export function updataRoleUser(id, data) {
  return request({
    url: '/role/users/' + id + '/',
    method: 'put',
    data
  })
}

export function deleteRoleUser(id) {
  debugger
  return request({
    url: '/role/users/' + id + '/',
    method: 'delete'
  })
}

export function getAccountUser(params) {
  return request({
    url: '/account/user/',
    method: 'get',
    params
  })
}
