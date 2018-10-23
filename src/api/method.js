import request from '@/utils/request'

export function get(file, data) {
  return request({
    url: '/apiweb' + file,
    method: 'GET',
    params: data
  })
}
export function post(file, data) {
  return request({
    url: '/apiweb' + file,
    method: 'POST',
    data
  })
}

export function wssget(file, data) {
  return request({
    url: '/apiwss' + file,
    method: 'GET',
    params: data
  })
}
export function wsspost(file, data) {
  return request({
    url: '/apiwss' + file,
    method: 'POST',
    data
  })
}
