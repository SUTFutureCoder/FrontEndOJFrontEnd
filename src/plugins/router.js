import Vue from 'vue'
import VueRouter from 'vue-router'
import * as RouterPath from '@/constants/router_path'

import Register from "@/components/account/Register"

import LabList from "@/components/lab/List"

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: RouterPath.REGISTER,
      component: Register,
    },
    {
      path: RouterPath.LAB_LIST,
      component: LabList,
    }

  ]
})
