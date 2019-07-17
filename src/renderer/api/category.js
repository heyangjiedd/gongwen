import request from '@/utils/request'

export function get(params) {
  return request({
    url: '/category',
    method: 'get',
    params,
  })
}

export function getById(id) {
  return request({
    url: `/category/${id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

export function update( data) {
  return request({
    url: `/category/${data.id}`,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: `/category/${id}`,
    method: 'delete'
  })
}
