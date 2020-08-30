<template>
  <v-app>
    <v-navigation-drawer
        permanent
        expand-on-hover
        fixed
    >
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">Sandra Adams</v-list-item-title>
            <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list
          nav
          dense
      >
        <v-list-item link @click="changeRouter(routerPath.LAB_LIST)">
          <v-list-item-icon>
            <v-icon>mdi-folder</v-icon>
          </v-list-item-icon>
          <v-list-item-title>My Files</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Shared with me</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-star</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Starred</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
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
