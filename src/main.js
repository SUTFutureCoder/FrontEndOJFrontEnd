import Vue from 'vue'

import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router'
import api from './api'
import store from './store'

Vue.prototype.$api = api

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
