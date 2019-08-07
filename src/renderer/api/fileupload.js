import request from '@/utils/request'

export const base = 'http://192.168.1.5:8020/'//全局baseUrl
export const baseUrl = base + 'v1/'//全局baseUrl

export function getByPath(params) {
    return request({
        url: `/getwordHtml`,
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
