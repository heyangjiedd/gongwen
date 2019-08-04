import request from '@/utils/request'

export const base = 'http://192.168.1.4:8020/'//全局baseUrl
export const baseUrl = base + 'v1/'//全局baseUrl

export function getByPath(params) {
    return request({
        url: `/getwordHtml/{filepath}/`,
        method: 'get',
        params
    })
}

