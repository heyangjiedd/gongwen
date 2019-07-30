import request from '@/utils/request'

export function get(params) {
  return request({
    url: '/user',
    method: 'get',
    params
  })
}

export function getById(id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/user/',
    method: 'post',
    data
  })
}

export function update( data) {
  return request({
    url: `/user/${data.Id}`,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}
