// 对axios进行二次封装，创建请求拦截器和响应拦截器
//
// Path: src/utils/axios-instance.ts
import axios, { type InternalAxiosRequestConfig } from 'axios'
import { getToken } from './auth'
import { removeToken } from './auth'
import router from '../router'
import { type AxiosRequestConfig } from 'axios'
import type { ErrorType } from './types'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response.status === 401) {
      removeToken()
      router.push('/login')
    }
    if (error.response.status === 500) {
      ElMessage.error(error.response.data.message)
    }
    return Promise.reject(error.response.data as ErrorType)
  }
)

export default service