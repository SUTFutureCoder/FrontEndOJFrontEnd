import Vue from 'vue'
import Vuex from 'vuex'
import message from '@/store/modules/message'
import user from '@/store/modules/user'
import * as sconst from '@/store/const'

Vue.use(Vuex)
export const store = new Vuex.Store({
  modules: {
    message,
    user,
  }
})

export const storeConst = sconst