import axios from "axios"
import {store, storeConst} from '@/store'
import * as config from "@/constants/config";

let instance = axios.create({timeout:500, withCredentials: true})

instance.interceptors.response.use(
  // 成功
  res => {
    errorHandle(res.status, res.data)
    if (res.status === 200 && res.data.code === 200) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res)
    }
  },
  // 失败
  error => {
    const {response} = error
    if (response) {
      errorHandle(response.status, response.data);
    }
    return Promise.reject(response)
  }
)

const errorHandle = (status, data) => {
  // 状态码
  if (status === 200 && data.code === 200) {
    return
  }
  // 业务错误
  store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
    text: (data.data !== undefined && data.data !== "") ? data.data : data.msg,
    color: "error",
  })
}


const request = (url, params) => {
  // 统一新增后端
  url = config.BASE_BACKEND + url
  return instance.post(url, params)
}

export {request}
export {instance}