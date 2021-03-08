
// 注意连接ws之前必须经过认证
function connectWs() {
  let ws = new WebSocket('ws://localhost:8086/ws');
  ws.onopen = function() {
    // subscribe to some channels
    ws.send(JSON.stringify({
      //.... some message the I must send when I connect ....
    }));
  };

  ws.onmessage = function(e) {
    console.log('Message:', e.data);
  };

  ws.onclose = function(e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
    setTimeout(function() {
      connectWs();
    }, 1000);
  };

  ws.onerror = function(err) {
    console.error('Socket encountered error: ', err.message, 'Closing socket');
    ws.close();
  };
}

connectWs()
