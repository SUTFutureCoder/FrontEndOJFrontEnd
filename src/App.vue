<template>
  <v-app>
    <v-app-bar
      app
      :collapse="!collapseOnScroll"
      :collapse-on-scroll="collapseOnScroll"
      color="primary"
      dark
      min-width="200"
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
      <div v-show="collapseOnScroll">
      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Collapsing Bar</v-toolbar-title>

      <v-spacer></v-spacer>
      </div>
      <v-checkbox
          v-model="collapseOnScroll"
          color="white"
          hide-details
      ></v-checkbox>
    </v-app-bar>


    <v-main
        class="overflow-y-auto"
    >
      <router-view></router-view>
    </v-main>


  </v-app>
</template>

<script>
import * as RouterPath from '@/constants/router_path'

export default {
  name: 'App',

  components: {
    // HelloWorld,
  },

  data: () => ({
    collapseOnScroll: true,
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
