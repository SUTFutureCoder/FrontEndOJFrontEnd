import Vue from 'vue'

import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router'
import {store} from './store'

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
