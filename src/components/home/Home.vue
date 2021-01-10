<template>
  <v-container>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title v-for="(router, index) in routerMap.routes" :key="index" @click="changeRouter(router.path)">{{router.path}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-container>
</template>
<script>
import { routerMap } from '@/plugins/router'

export default {
  name: "Home",
  data: () => ({
    routerMap: routerMap,
  }),
  methods: {
    changeRouter(path) {
      this.$router.push({path: path})
    }
  }
}

</script>