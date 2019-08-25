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

export function CreateLicense(id) {
    return request({
        url: `/license/CreateLicense/${id}`,
        method: 'get'
    })
}

export function add(data) {
  return request({
    url: '/license/',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/license/${data.id||data.Id}`,
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
