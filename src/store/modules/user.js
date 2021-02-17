import * as c from '@/store/const'

const state = () => ({
  userinfo: {
    id: 0,
    name: "",
    type: "",
    login: false,
  }
})

const getters = {}

const actions = {
  [c.ACTIONS_SET_USER_INFO]: (context, payload) => {
    context.commit(c.USER_INFO_SET, payload)
  }
}

const mutations = {
  [c.USER_INFO_SET](state, payload) {
    state.userinfo.id = payload.id !== undefined ? payload.id : ""
    state.userinfo.name = payload.name !== undefined ? payload.name : ""
    state.userinfo.type = payload.user_type !== undefined ? payload.user_type : ""
    if (state.userinfo.id !== 0) {
      state.userinfo.login = true
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}