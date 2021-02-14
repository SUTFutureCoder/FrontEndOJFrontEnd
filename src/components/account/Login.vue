<template>
  <v-container
      class="fill-height"
      fluid
  >
    <v-row
        align="center"
        justify="center"
    >
      <v-col
          cols="12"
          sm="8"
          md="4"
      >
        <v-card class="elevation-12">
          <v-toolbar
              color="primary"
              dark
              flat
          >
            <v-toolbar-title>登录</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-alert
                dense
                outlined
                type="error"
                v-if="login_failed"
            >
             登录失败，请重试
            </v-alert>
            <v-form>
              <v-text-field
                  label="username"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="user_name"
              ></v-text-field>

              <v-text-field
                  label="password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="user_password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="reg">注册</v-btn>
            <v-btn color="primary" @click="login">登录</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import * as RouterPath from "@/constants/router_path"
import {apiUser} from "@/api";

export default {
  name: "Login",
  data: () => ({
    user_name: "",
    user_password: "",

    login_failed: false,
  }),
  methods: {
    login() {
      apiUser.login({
        user_name: this.user_name,
        user_password: this.user_password,
      }).then(() => {
        this.login_failed = false
        this.$router.push({path: RouterPath.LAB_LIST})
      }).catch(() => {})
    },
    reg() {
      this.$router.push({path: RouterPath.REGISTER,})
    }
  }

}
</script>

<style scoped>

</style>