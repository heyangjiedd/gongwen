import request from '@/utils/request'

export function getByIdCoorectName(id) {
  return request({
    url: `/word/CoorectName/${id}`,
    method: 'get'
  })
}

export function addCoorectName(data) {
  return request({
    url: '/word/CoorectName/',
    method: 'post',
    data
  })
}

export function updateCoorectName(data) {
  return request({
    url: `/word/CoorectName/${data.id||data.Id}`,
    method: 'post',
    data
  })
}

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
    url: '/word/',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/word/${data.id||data.Id}`,
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
