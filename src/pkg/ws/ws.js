import * as Strategy from '@/pkg/strategy/strategy'

export function InitWs(state) {
  state.ws = new WebSocket('ws://localhost:8086/ws')
  state.ws.onopen = () => {
    console.log('connection open')
  }
  state.ws.onmessage = (evt) => {
    // strategy list
    HandleWsMessage(evt.data)
  }
  state.ws.onclose = () => {
    console.log('connection close')
    setTimeout(function() {
      InitWs(state)
    }, 1000);
  }
}

export function HandleWsMessage(data) {
  let obj = JSON.parse(data)
  Strategy.execStrategy(obj.data.type, obj.data)
}

export function SendWs(state, cmd, data) {
  if (state.ws == null) {
    InitWs(state)
  }
  state.ws.send(JSON.stringify({cmd: cmd, data: data}))
}
