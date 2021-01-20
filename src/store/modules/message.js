import * as mutation from '@/store/mutation_const'

const state = () => ({
  // 全局消息条
  // https://vuetifyjs.com/zh-Hans/components/snackbars/
  snackbar: {
    snackbar: false,
    text: "",
    color: "primary",
    timeout: "2000",
  }
})

const getters = {}

const actions = {}

const mutations = {
  [mutation.SNACKBAR_SHOW](state, payload) {
    state.snackbar.snackbar = true
    state.snackbar.text = payload.text !== undefined ? payload.text : ""
    state.snackbar.color = payload.color !== undefined ? payload.color : "primary"
    state.snackbar.timeout = payload.timeout !== undefined ? payload.timeout : "2000"
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
