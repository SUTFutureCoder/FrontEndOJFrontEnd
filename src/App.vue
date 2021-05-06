<template>
  <v-app>

    <AppbarHome/>

    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- 全局snackbar -->
    <MessageCenter/>

    <!--  预先加载  -->
    <MMonacoEditor v-show="false" mode="html" :cdnUrl=config.MONACO_CDN :syncInput=true theme="vs"/>

  </v-app>
</template>

<script>

import AppbarHome from "@/components/public/appbar/AppbarHome";
import MessageCenter from "@/components/public/message/MessageCenter";
import MMonacoEditor from 'vue-m-monaco-editor'
import * as config from "@/constants/config"

export default {
  name: 'App',
  data: () => ({
    config: config,
  }),
  components: {
    AppbarHome,
    MessageCenter,
    MMonacoEditor,
  },
};
</script>

<style>
.container {
  padding: 6px 6px 0 6px;
}
</style>
