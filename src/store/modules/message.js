import * as c from '@/store/const'

const state = () => ({
  // 全局消息条
  // https://vuetifyjs.com/zh-Hans/components/snackbars/
  snackbar: {
    snackbar: false,
    text: "",
    color: "primary",
    timeout: "3000",
  },
  ws: null,
})

const getters = {}

const actions = {
  [c.ACTIONS_SNACKBAR_SHOW]: (context, payload) => {
    context.commit(c.SNACKBAR_SHOW, payload)
  },
  [c.ACTIONS_WS_CONN]: (context) => {
    context.commit(c.WEBSOCKET_CONN)
  }
}

const mutations = {
  [c.SNACKBAR_SHOW](state, payload) {
    state.snackbar.snackbar = true
    state.snackbar.text = payload.text !== undefined ? payload.text : ""
    state.snackbar.color = payload.color !== undefined ? payload.color : "primary"
    state.snackbar.timeout = payload.timeout !== undefined ? payload.timeout : "3000"
    // 附加取消
    setTimeout(() => {
      state.snackbar.snackbar = false
    }, parseInt(state.snackbar.timeout, 10))
  },
  [c.WEBSOCKET_CONN](state) {
    console.log('init websocket')
    state.ws = new WebSocket('ws://localhost:8086/ws'),
      state.ws.onopen = () => {
        console.log('connection open')
      }
    state.ws.onmessage = (evt) => {
      console.log(evt)
    }
    state.ws.onclose = () => {
      console.log('connection close')
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
