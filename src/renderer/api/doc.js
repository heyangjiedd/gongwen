import request from '@/utils/request'

export function get(params) {
  return request({
    url: '/doc',
    method: 'get',
    params
  })
}

export function getById(id) {
  return request({
    url: `/doc/${id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/doc/',
    method: 'post',
    data
  })
}

export function update( data) {
  return request({
    url: `/doc/${data.id||data.Id}`,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: `/doc/${id}`,
    method: 'delete'
  })
}
