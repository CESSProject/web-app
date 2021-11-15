import axios from 'axios'
import {
  apiUrl
} from './url'
import store from '../store'
import {
  Message
} from 'element-ui'

const service = axios.create({
  baseURL: apiUrl,
  timeout: 55000
})

// request
service.interceptors.request.use(config => {
  if (store.state.userInfo.data) {
    config.headers = {
      "cess-token": store.state.userInfo.data.myAddress + ':' + store.state.userInfo.data.signature
    }
  }
  console.log("request Header====================", config.headers)
  // console.log("request url==================", config.url)

  return config
}, error => {
  // Do something with request error
  Promise.reject(new Error(error))
})

service.interceptors.response.use(
  response => {
    const data = response.data
    console.log("response===========22222222222=====", response)
    if (data.errorCode === '010000' || data.errorCode === '010006') {
      store.dispatch('userInfo/logout').then(() => {
        location.reload()
      });
    }
    return response.data
  },
  error => {
    console.log("error+++++++++++++++++++", error)
    let n1 = '';
    let n2 = '';
    n1 = 'Token expired, please login again';
    n2 = 'Network exception, please try again later';
    if (error.response.status === 401) {
      Message({
        message: n1,
        type: 'error',
        duration: 3 * 1000
      })
      store.commit('userInfo/clearUserInfo')
      // router.push('/')
    }

    if (error.response.status !== 401 && error.response.status !== 200) {
      Message({
        message: n2,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return Promise.reject(new Error(error))
  }
)

export default service