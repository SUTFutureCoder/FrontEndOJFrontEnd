import Vue from 'vue'
import Vuex from 'vuex'
import message from '@/store/modules/message'
import * as sconst from '@/store/const'

Vue.use(Vuex)
export const store = new Vuex.Store({
  modules: {
    message,
  }
})

export const storeConst = sconst