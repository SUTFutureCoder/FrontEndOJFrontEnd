<template>
  <v-app-bar
      app
      color="primary"
      dark
      min-width="200"
  >
    <div class="d-flex align-center">
      <v-chip
          class="ma-2"
          color="primary"
          label
          large
          @click="userName !== '' ? changeRouter(routerPath.INFO) : changeRouter(routerPath.LOGIN)"
      >
        <v-card-text class="appbar-user-chip-text" v-if="userName === ''">Project Caroline</v-card-text>
        <v-card-text class="appbar-user-chip-text" v-if="userName !== ''">{{this.userName}}'s Caroline</v-card-text>
      </v-chip>
    </div>

    <v-spacer></v-spacer>
    <v-btn
        @click="changeRouter(routerPath.LAB_LIST)"
        text
        x-large
    >
      <span class="mr-2">Labs</span>
    </v-btn>
    <v-btn
        @click="changeRouter(routerPath.CONTEST_LIST)"
        text
        x-large
    >
      <span class="mr-2">Contests</span>
    </v-btn>
    <v-menu
        offset-y
        open-on-hover
        v-if="this.userType === userTypeConst.USERTYPE_ADMIN"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            text
            x-large
            v-bind="attrs"
            v-on="on"
        >
          Admin
        </v-btn>
      </template>
      <v-list>
        <v-list-item
            @click="changeRouterWithQuery(routerPath.ADMIN_LAB_LIST, {adminMode:true, t: Date.now()})"
        >
          <v-list-item-title>Lab</v-list-item-title>
        </v-list-item>
        <v-list-item
            @click="changeRouterWithQuery(routerPath.ADMIN_CONTEST_LIST)"
        >
          <v-list-item-title>Contest</v-list-item-title>
        </v-list-item>
        <v-list-item
            @click="changeRouterWithQuery(routerPath.ADMIN_CONTEST_PUT)"
        >
          <v-list-item-title>ContestCreate[temp]</v-list-item-title>
        </v-list-item>
        <v-list-item
            @click="changeRouterWithQuery(routerPath.ADMIN_USER_LIST)"
        >
          <v-list-item-title>User</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import {mapState} from 'vuex'
import * as RouterPath from '@/constants/router_path'
import * as user from "@/constants/user";
import {apiUser} from "@/api";
import {store, storeConst} from "@/store";
import * as userType from "@/constants/user";
export default {
  name: "AppbarHome",

  data: () => ({
    routerPath: RouterPath,
    userTypeConst: userType,
  }),
  computed: mapState({
    userId: state => state.user.userinfo.id,
    userName: state => state.user.userinfo.name,
    userType: state => state.user.userinfo.type,
    isLogin: state => state.user.userinfo.login,
    userTypeStr: state => user.USERTYPE_STR_MAP.get(state.user.userinfo.type)
  }),
  mounted() {
    apiUser.whoami().then(response => {
      store.dispatch(storeConst.DISPATCH_SET_USER_INFO, {
        id: response.data.data.id,
        name: response.data.data.name,
        user_type: response.data.data.user_type,
      })
    }).catch()
  },
  methods: {
    changeRouter: function (routerPath) {
      this.$router.push({path: routerPath})
    },
    changeRouterWithQuery: function (routerPath, query) {
      this.$router.push({path: routerPath, query: query})
    },
  }
}
</script>

<style scoped>
.appbar-user-chip-text{
  font-size: 20px;
}
</style>