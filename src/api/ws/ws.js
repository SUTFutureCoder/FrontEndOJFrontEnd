
export
// 注意连接ws之前必须经过认证

let ws = new WebSocket('ws://localhost:8086/ws')
ws.onopen = () => {
  console.log('connection open')
}
ws.onmessage = (evt) => {
  console.log(evt)
}
ws.onclose = () => {
  console.log('connection close')
}

