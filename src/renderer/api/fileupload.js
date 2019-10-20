import request from '@/utils/request'

export const base = 'http://47.108.65.129:8020/'//全局baseUrl
// export const base = 'http://127.0.0.1:8020/'//全局baseUrl
export const baseUrl = base + 'v1/'//全局baseUrl

export function getByWord(params) {
  return request({
    url: `/WordOperation/getrevise`,
    method: 'get',
    params
  })
}
export function saveWord(data) {
  return request({
    url: `/WordOperation/torevise`,
    method: 'post',
    data
  })
}

export function upload(data) {
  return request({
    url: '/upload',
    method: 'post',
    headers: { "Content-Type": "multipart/form-data" },
    data
  })
}
export function getByPath(params) {
  return request({
    url: `/getwordHtml`,
    method: 'get',
    params
  })
}

export function getmistakewordHtml(params) {
  return request({
    url: `/getmistakewordHtml`,
    method: 'get',
    params
  })
}

export function reviseToWord(data) {
  return request({
    url: '/reviseToWord',
    method: 'post',
    data
  })
}

export function wordformat(params) {
  return request({
    url: `/wordformat`,
    method: 'get',
    params
  })
}
export function getsuggestWord(params) {
  return request({
    url: `/getsuggestWord`,
    method: 'get',
    params
  })
}
export function exportsystem() {
  return request({
    url: `/exportsystem`,
    method: 'get',
  })
}
export function getoperation(params) {
  return request({
    url: `/getoperation`,
    method: 'get',
    params,
  })
}
export function exportdatabaseruser(id) {
  return request({
    url: `/exportdatabaseruser/${id}`,
    method: 'get',
  })
}
export function userstoupgrade() {
  return request({
    url: `/userstoupgrade`,
    method: 'get',
  })
}
export function exportDataBaser(id) {
  return request({
    url: `/exportDataBaseruser/${id}`,
    method: 'get',
  })
}
export function updateDataBaser(id,data) {
  return request({
    url: `/updateDataBaser/${id}`,
    headers: { "Content-Type": "multipart/form-data" },
    method: 'post',
    data,
  })
}
