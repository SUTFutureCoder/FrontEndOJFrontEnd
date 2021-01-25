import * as api from "@/api/api_const";
import * as base from "@/api/base";

export const user = {
  // 登录
  login: (data) => base.request(api.LOGIN, data),
  // 注册
  register: (data) => base.request(api.REG, data),
}