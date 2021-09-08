import * as c from '@/store/const'
import * as ws from '@/pkg/ws/ws'

const state = () => ({
  ws: null,
  msg: {},
})

const actions = {
  [c.ACTIONS_WS_CONN]: (context) => {
    context.commit(c.WEBSOCKET_CONN)
  },
  [c.ACTIONS_WS_SEND]: (context, payload) => {
    context.commit(c.WEBSOCKET_SEND, payload)
  },
  [c.ACTIONS_WS_MSG]: (context, payload) => {
    context.commit(c.WEBSOCKET_MSG, payload)
  }
}

const mutations = {
  [c.WEBSOCKET_CONN](state) {
    console.log('init websocket')
    ws.InitWs(state)
  },
  [c.WEBSOCKET_SEND](state, payload) {
    ws.SendWs(state, payload.cmd, payload.data)
  },
  [c.WEBSOCKET_MSG](state, payload) {
    state.msg[payload.type] = payload.Data
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}