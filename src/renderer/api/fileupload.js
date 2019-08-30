import request from '@/utils/request'

export const base = 'http://47.108.65.129:8020/'//全局baseUrl
export const baseUrl = base + 'v1/'//全局baseUrl

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
export function exportDataBaser() {
    return request({
        url: `/exportDataBaser`,
        method: 'get',
    })
}
export function updateDataBaser() {
    return request({
        url: `/updateDataBaser`,
        method: 'get',
    })
}