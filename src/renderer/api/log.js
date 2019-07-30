import request from '@/utils/request'

export function get(params) {
  return request({
    url: '/log',
    method: 'get',
    params
  })
}

export function getById(id) {
  return request({
    url: `/log/${id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/log/',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: `/log/${id}`,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: `/log/${id}`,
    method: 'delete'
  })
}
