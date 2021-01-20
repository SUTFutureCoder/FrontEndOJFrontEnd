<template>
  <v-app>
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
            @click="changeRouter(routerPath.HOME)"
        >
          <v-icon left>
            mdi-account-circle-outline
          </v-icon>
          Project Carlone
        </v-chip>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>


    <v-main
        class="overflow-y-auto"
    >
      <router-view></router-view>
    </v-main>

    <!-- 全局snackbar -->
    <MessageCenter/>

  </v-app>
</template>

<script>
import * as RouterPath from '@/constants/router_path'
import MessageCenter from "@/components/message/MessageCenter";

export default {
  name: 'App',

  components: {
    // HelloWorld,
    MessageCenter,
  },

  data: () => ({
    routerPath: RouterPath,
  }),

  methods: {
    changeRouter: function (routerPath) {
      this.$router.push({path: routerPath})
    }
  }
};
</script>

<style>

</style>
