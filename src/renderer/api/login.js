import request from '@/utils/request'

export function login(username, Password) {
    return request({
        url: '/login/',
        method: 'get',
        params: {
            Account: username,
            Password
        }
    })
}

export function getInfo(token) {
    return new Promise((resolve, reject) => {
        resolve({code: 20000, data: {name: 'Admin', introduction: 'I am a super administrator', roles: ['admin']}})
    })
    return request({
        url: '/user/info',
        method: 'get',
        params: {token}
    })
}

export function logout() {
    return new Promise((resolve, reject) => {
        resolve()
    })
    return request({
        url: '/user/logout',
        method: 'post'
    })
}
