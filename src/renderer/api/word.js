import request from '@/utils/request'

export function get(params) {
  return request({
    url: '/word',
    method: 'get',
    params
  })
}

export function getById(id) {
  return request({
    url: `/word/${id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/word',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/word/${data.id}`,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: `/word/${id}`,
    method: 'delete'
  })
}
