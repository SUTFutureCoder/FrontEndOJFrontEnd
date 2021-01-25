<template>
  <v-app>

    <AppbarHome/>

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

import AppbarHome from "@/components/public/appbar/AppbarHome";
import MessageCenter from "@/components/public/message/MessageCenter";

export default {
  name: 'App',
  components: {
    AppbarHome,
    MessageCenter,
  },
};
</script>

<style>
</style>
