import request from '@/utils/request'

export function get(params) {
  return request({
    url: '/company',
    method: 'get',
    params,
  })
}

export function getById(id) {
  return request({
    url: `/company/${id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/company/',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: `/company/${id}`,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: `/company/${id}`,
    method: 'delete'
  })
}
