import * as api from "@/api/api_const";
import * as base from "@/api/base";

export const contest = {
  // 创建比赛
  createContest: (data) => base.request(api.CONTEST_CREATE, data),
  // 获取比赛详情
  getContestInfo: (data) => base.request(api.CONTEST_INFO, data),
  // 修改比赛
  modifyContest: (data) => base.request(api.CONTEST_MODIFY, data),
  // 获取绑定实验室列表
  getContestBind: (data) => base.request(api.CONTEST_GET_LABS, data),
  // 绑定实验室
  manageLabs: (data) => base.request(api.CONTEST_MANAGE_LABS, data),
  // 变更实验室状态
  modifyStatus: (data) => base.request(api.CONTEST_STATUS_MODIFY, data),
  // 比赛列表
  contestWithSummary: (data) => base.request(api.CONTEST_LIST_WITH_SUMMARY, data),
  // 检查是否可以进入比赛
  tryAccess: (data) => base.request(api.CONTEST_TRY_ACCESS, data),
}