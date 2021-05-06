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
}