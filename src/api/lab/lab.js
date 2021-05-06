import * as api from "@/api/api_const";
import * as base from "@/api/base";

export const lab = {
  // 获取实验室详情
  getLabInfo: (data) => base.request(api.LAB_INFO, data),
  // 获取实验室列表
  getLabList: (data) => base.request(api.LAB_LIST, data),
  // 获取实验室聚合列表
  getLabSummaryList: (data) => base.request(api.LAB_SUMMARY_LIST, data),

  // 添加实验室
  addLab: (data) => base.request(api.LAB_ADD, data),
  // 变更实验室
  modifyLab: (data) => base.request(api.LAB_MODIFY, data),
  // 上线实验室
  enableLab: (data) => base.request(api.LAB_ENABLE, data),
  // 下线实验室
  disableLab: (data) => base.request(api.LAB_DISABLE, data),
  // 变更实验室状态为建造中
  constructingLab: (data) => base.request(api.LAB_CONSTRUCTING, data),

  // 实验室测试用例
  getLabTestList: (data) => base.request(api.LAB_TESTCASE_LIST, data),
  // 实验室测试用例运行测试
  runLabTestcase: (data) => base.requestNoTimeout(api.LAB_TESTCASE_RUN, data),
  // 设置实验室测试用例
  setLabTestcase: (data) => base.request(api.LAB_TESTCASE_SET, data),
  // 上传测试用例图片
  uploadTestcaseImg: (data, axiosConfig) => base.requestWithConfig(api.TOOL_UPLOAD_FILE, data, axiosConfig)
}
