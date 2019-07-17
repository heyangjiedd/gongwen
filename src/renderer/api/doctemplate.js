import request from '@/utils/request'

export function get(params) {
  return request({
    url: '/doctemplate',
    method: 'get',
    params
  })
}

export function getById(id) {
  return request({
    url: `/doctemplate/${id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/doctemplate',
    method: 'post',
    data
  })
}

export function update( data) {
  return request({
    url: `/doctemplate/${data.id}`,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: `/doctemplate/${id}`,
    method: 'delete'
  })
}
