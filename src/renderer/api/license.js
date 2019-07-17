import request from '@/utils/request'

export function get(params) {
  return request({
    url: '/license',
    method: 'get',
    params
  })
}

export function getById(id) {
  return request({
    url: `/license/${id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/license',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: `/license/${id}`,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: `/license/${id}`,
    method: 'delete'
  })
}
