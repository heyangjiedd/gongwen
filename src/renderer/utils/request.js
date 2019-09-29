import axios from 'axios'
import {Message, MessageBox, Loading} from 'element-ui'
import store from '../store'
import {objToLocaleLowerCaseKey} from '@/utils'
import {baseUrl} from "@/api/fileupload";

let loadingInstance;
let loadingIndex = 1
// 创建axios实例
const service = axios.create({
    baseURL: baseUrl, // api的base_url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 500000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
    if (store.getters.token) {
        // config.headers['X-Token'] = store.getters.token// 让每个请求携带自定义token 请根据实际情况自行修改
    }
    loadingIndex++;
    loadingInstance = Loading.service({text: '请求中', background: 'rgba(0, 0, 0, 0.28)',spinner: 'el-icon-loading',});
    if((config.method ==='post'||config.method ==='put')&&(config.headers['Content-Type'] != 'multipart/form-data') ){
        config.data = objToLocaleLowerCaseKey(config.data)
    }
    if (config.method === 'get' && config.url!='/getsuggestWord') {
        config.params = objToLocaleLowerCaseKey(config.params)
    }
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        loadingIndex--;
        if(loadingIndex===1) loadingInstance.close();
        const res = response.data
        if (res.code !== 0) {
            Message({
                message: res.message,
                type: 'error',
                duration: 5 * 1000
            })
            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                MessageBox.confirm('你已被登出，可以取消留在该页面，或者重新登录。', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload()// 为了重新实例化vue-router对象 避免bug
                    })
                })
            }
            return Promise.reject('error')
        } else {
            if (res.filesurl) {
                return res.filesurl
            }
            if (res.extend) {
                return res.extend
            }
            if(typeof res.data == 'string'){
                return res.data
            }
            return res.data && {...res.data, Data: res.data.data, Recordsfiltered: Number(res.data.recordsFiltered)}
        }
    },
    error => {
        loadingIndex--;
        if(loadingIndex===1) loadingInstance.close();
        console.log('err' + error)// for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
