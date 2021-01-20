import Vue from 'vue'
import Vuex from 'vuex'
import message from '@/store/modules/message'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    message,
  }
})

export default store