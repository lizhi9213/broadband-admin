import axios from 'axios'
import store from '@/store'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  response => response,
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  error => {
    console.log(error.response)
    if (error.response.status === 500) {
    } else if (
      error.response.status === 401 &&
      error.response.config.url.indexOf('/login/') < 0
    ) {
    } else {
      if (error.response.data.message) {
      }
    }
    return Promise.reject(error)
  }
)

export default service
