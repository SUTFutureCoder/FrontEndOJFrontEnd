import axios from "axios"
import {store, storeConst} from '@/store'
import * as config from "@/constants/config";
import * as colors from "@/constants/color"
import * as RouterPath from "@/constants/router_path";

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

let instance = axios.create({withCredentials: true})
instance.interceptors.response.use(
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
  if (data.code === 402) {
    setTimeout(() => {
      window.location=RouterPath.LOGIN
    }, 1000)
  }
  if (data.code === 401) {
    setTimeout(() => {
      window.location=RouterPath.INFO
    }, 1000)
  }
}


const request = (url, params) => {
  // 统一新增后端
  return instance.post(config.BASE_BACKEND + url, params, {timeout:5000,})
}
const requestNoTimeout = (url, params) => {
  // 统一新增后端
  return instance.post(config.BASE_BACKEND + url, params, {})
}
const requestWithConfig = (url, params, axiosConfig) => {
  return instance.post(config.BASE_BACKEND + url, params, axiosConfig)
}

export {request}
export {requestNoTimeout}
export {requestWithConfig}
export {instance}
