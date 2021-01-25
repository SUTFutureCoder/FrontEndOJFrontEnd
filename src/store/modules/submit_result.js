import * as c from '@/store/const'

const state = () => ({
  submit_result: {
    submitItem: {
    },
    resultList: [],
    dialog: false,
  }
})

const getters = {}

const actions = {
  [c.ACTIONS_SUBMIT_RESULT_SHOW]: (context, payload) => {
    context.commit(c.SUBMIT_RESULT_SHOW, payload)
  }
}

const mutations = {
  [c.SUBMIT_RESULT_SHOW](state, payload) {
    state.submit_result.dialog = true
    state.submit_result.submitItem = payload !== undefined ? payload : {}
    state.submit_result.resultList = payload.resultList !== undefined ? payload.resultList : []
  },
  [c.SUBMIT_RESULT_HIDE](state) {
    state.submit_result.dialog = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}