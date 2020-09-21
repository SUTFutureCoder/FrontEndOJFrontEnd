import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router'

Vue.config.productionTip = false
axios.defaults.withCredentials = true

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
