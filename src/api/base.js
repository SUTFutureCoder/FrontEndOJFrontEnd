import axios from "axios";
import store from '@/store/index'
import * as mutation from "@/store/mutation_const";

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
  store.commit(mutation.MODULE_MESSAGE + mutation.SNACKBAR_SHOW, {
    text: data.msg,
  })
  switch (data.code) {
    case 406:
      alert("FUCK YOU")
  }

  // 网络错误
  switch (status) {
    case 400:
      alert("test")
  }
}

const request = (url, params) => {
  return instance.post(url, params)
}

export {request}
export {instance}