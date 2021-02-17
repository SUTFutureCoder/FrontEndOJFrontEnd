import * as api from "@/api/api_const";
import * as base from "@/api/base";

export const user = {
  // 登录
  login: (data) => base.request(api.USER_LOGIN, data),
  // 注册
  register: (data) => base.request(api.USER_REG, data),
  // 注销
  logout: (data) => base.request(api.USER_LOGOUT, data),
  // who am i
  whoami: (data) => base.request(api.USER_WHOAMI, data),
  // summary
  summary: (data) => base.request(api.USER_SUMMARY, data),
  // 年度聚合
  yearSummary: (data) => base.request(api.INFO_YEAR_SUMMARY, data),
  // 用户某天提交
  getUserDaySubmits: (data) => base.request(api.USER_DAY_SUBMITS, data),
  // 列表
  getUserSummaryList: (data) => base.request(api.USER_LIST, data),
  // 创建
  createUser: (data) => base.request(api.USER_CREATE, data),
  // 封禁
  disableUser: (data) => base.request(api.USER_DISABLE, data),
  // 解封
  enableUser: (data) => base.request(api.USER_ENABLE, data),
  // 修改密码
  changePwd: (data) => base.request(api.USER_CHANGE_PWD, data),
  // 变更
  editUser: (data) => base.request(api.USER_MODIFY, data),

}