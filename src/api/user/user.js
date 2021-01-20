import * as config from "@/constants/config";
import * as api from "@/api/api_const";
import * as base from "@/api/base";

const user = {
  // 登录
  login(data) {
    return base.request(
      config.BASE_BACKEND + api.LOGIN, data,
    )
  }
}

export default user