import Vue from 'vue'
import Vuex from 'vuex'
import message from '@/store/modules/message'
import submit_result from '@/store/modules/submit_result'
import * as sconst from '@/store/const'

Vue.use(Vuex)
export const store = new Vuex.Store({
  modules: {
    message,
    submit_result,
  }
})

export const storeConst = sconst