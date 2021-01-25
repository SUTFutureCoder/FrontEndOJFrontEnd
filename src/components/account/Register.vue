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
            <v-toolbar-title>注册</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-alert
                dense
                outlined
                type="error"
                v-if="confirm_failed"
            >
              两次密码输入不一致，请重试
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

              <v-text-field
                  label="password_confirm"
                  name="password_confirm"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="user_password_confim"
                ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="success" @click="register">注册</v-btn>
              <v-btn color="primary" @click="login">登录</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import {apiUser} from '@/api'

export default {
  name: "Register",
  data: () => ({
    user_name: "",
    user_password: "",
    user_password_confim: "",

    confirm_failed: false,
  }),
  methods: {
    login() {
      if (this.user_password !== this.user_password_confim) {
        this.confirm_failed = true
        this.user_password = ""
        this.user_password_confim = ""
        return
      }
      apiUser.register({
        user_name: this.user_name,
        user_password: this.user_password,
      }).then(response => {
        console.log(response)
      }).catch(err => {
        console.log(err)
      })
    },
    register() {

    }
  }

}
</script>

<style scoped>

</style>