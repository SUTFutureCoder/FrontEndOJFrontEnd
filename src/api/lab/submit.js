import * as api from "@/api/api_const";
import * as base from "@/api/base";

export const submit = {
  // 获取提交列表
  submitListByLabId: (data) => base.request(api.LAB_SUBMIT_LIST_BY_LAB_ID, data),
  // 提交
  submitLab: (data) =>  base.request(api.LAB_SUBMIT, data),
}

