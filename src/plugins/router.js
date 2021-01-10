import Vue from 'vue'
import VueRouter from 'vue-router'
import * as RouterPath from '@/constants/router_path'

import Login from "@/components/account/Login";
import Register from "@/components/account/Register"

import LabList from "@/components/lab/List"
import LabInfo from "@/components/lab/Info"
import PutLab from "@/components/admin/PutLab";
import PutLabTestcase from "@/components/admin/PutLabTestcase";
import Home from "@/components/home/Home";

Vue.use(VueRouter)

export const routerMap = {
  mode: 'history',
  routes: [
    // 主页[测试版用于调试]
    {
      path: RouterPath.HOME,
      component: Home,
    },
    // 账号系统
    {
      path: RouterPath.REGISTER,
      component: Register,
    },
    {
      path: RouterPath.LOGIN,
      component: Login,
    },

    // 实验室
    {
      path: RouterPath.LAB_LIST,
      component: LabList,
    },
    {
      path: RouterPath.LAB_INFO,
      component: LabInfo,
    },

    // 管理员
    {
      path: RouterPath.ADMIN_LAB_PUT,
      component: PutLab,
    },
    {
      path: RouterPath.ADMIN_LAB_TESTCASE_PUT,
      component: PutLabTestcase,
    }
  ]
}

export default new VueRouter(routerMap)
