import * as api from "@/api/api_const";
import * as base from "@/api/base";

export const lab = {
  // 获取实验室详情
  getLabInfo: (data) => base.request(api.LAB_INFO, data),
  // 获取实验室列表
  getLabList: (data) => base.request(api.LAB_LIST, data),

  // 添加实验室
  addLab: (data) => base.request(api.LAB_ADD, data),
  // 变更实验室
  updateLab: (data) => base.request(api.LAB_UPDATE, data),

  // 实验室测试用例
  getLabTestList: (data) => base.request(api.LAB_TESTCASE_LIST, data),
  // 实验室测试用例运行测试
  runLabTestcase: (data) => base.requestNoTimeout(api.LAB_TESTCASE_RUN, data),
  // 添加实验室测试用例
  setLabTestcase: (data) => base.requestNoTimeout(api.LAB_TESTCASE_SET, data),
}
