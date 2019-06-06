import request from '@/utils/request'

// 获取图片
export function getPhoto(params) {
  return request({
    url: '/inspection-log/photo-log/',
    method: 'get',
    params
  })
}
