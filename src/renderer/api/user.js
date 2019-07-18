import request from '@/utils/request'

export function login(data) {
  // return new Promise((resolve, reject) => {
  //   resolve({code:20000,data:{token:'admin-token'}})
  // })
  return request({
    url: '/login/',
    method: 'get',
    data
  })
}

export function getInfo(token) {
  return new Promise((resolve, reject) => {
    resolve({code:20000,data:{name:'Admin',introduction:'I am a super administrator',roles:['admin']}})
  })
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
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