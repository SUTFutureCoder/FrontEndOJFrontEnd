import Vue from 'vue'
import VueRouter from 'vue-router'
import * as RouterPath from '@/constants/router_path'

import Home from "@/components/home/Home"

import Login from "@/components/account/Login"
import Register from "@/components/account/Register"
import Info from "@/components/account/Info"

import LabList from "@/components/public/lab/LabList"
import LabInfo from "@/components/lab/Info"
import AdminPutLab from "@/components/admin/PutLab"
import AdminPutLabTestcase from "@/components/admin/PutLabTestcase";
import AdminPutLabImitateTestcase from "@/components/admin/PutImitateLabTestcase";
import UserList from "@/components/admin/UserList";


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
    {
      path: RouterPath.INFO,
      component: Info,
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
      component: AdminPutLab,
    },
    {
      path: RouterPath.ADMIN_LAB_TESTCASE_NORMAL_PUT,
      component: AdminPutLabTestcase,
    },
    {
      path: RouterPath.ADMIN_LAB_TESTCASE_IMITATE_PUT,
      component: AdminPutLabImitateTestcase,
    },
    {
      path: RouterPath.ADMIN_USER_LIST,
      component: UserList,
    },
    {
      path: RouterPath.ADMIN_LAB_LIST,
      component: LabList,
    }
  ]
}

export default new VueRouter(routerMap)
