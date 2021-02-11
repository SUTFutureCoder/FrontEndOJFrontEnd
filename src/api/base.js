import axios from "axios"
import {store, storeConst} from '@/store'
import * as config from "@/constants/config";
import * as colors from "@/constants/color"

const handleSuccess = res => {
  errorHandle(res.status, res.data)
  if (res.status === 200 && res.data.code === 200) {
    return Promise.resolve(res)
  } else {
    return Promise.reject(res)
  }
}

const handleFailed = error => {
  const {response} = error
  if (response) {
    errorHandle(response.status, response.data);
  }
  return Promise.reject(response)
}

let instance = axios.create({timeout:500, withCredentials: true})
instance.interceptors.response.use(
  // 成功
  handleSuccess,
  // 失败
  handleFailed,
)

let instance_no_timeout = axios.create({withCredentials: true})
instance_no_timeout.interceptors.response.use(
  // 成功
  handleSuccess,
  // 失败
  handleFailed,
)

const errorHandle = (status, data) => {
  // 状态码
  if (status === 200 && data.code === 200) {
    return
  }
  console.log(data.data)
  // 业务错误
  store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
    text: (data.data !== undefined && data.data != null && data.data !== "") ? data.data : data.msg,
    color: colors.RED,
  })
}


const request = (url, params) => {
  // 统一新增后端
  url = config.BASE_BACKEND + url
  return instance.post(url, params)
}
const requestNoTimeout = (url, params) => {
  // 统一新增后端
  url = config.BASE_BACKEND + url
  return instance_no_timeout.post(url, params)
}

export {request}
export {requestNoTimeout}
export {instance}
export {instance_no_timeout}
