import Vue from 'vue'
import VueRouter from 'vue-router'
import * as RouterPath from '@/constants/router_path'

import Login from "@/components/account/Login";
import Register from "@/components/account/Register"

import LabList from "@/components/lab/List"
import LabInfo from "@/components/lab/Info"
import AddLab from "@/components/admin/AddLab";

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
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
      path: RouterPath.ADMIN_LAB_ADD,
      component: AddLab,
    }
  ]
})
