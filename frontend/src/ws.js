let ws;
let listeners = [];

export const init = () => {
  ws = new WebSocket('ws://localhost:8080');
  ws.onmessage = function(event) {
    console.log(event)
    listeners.forEach(l => {
      l(event.data)
    });
  }
}

export const sendMessage = (msg) => {
  const payload = {
    type: 'msg',
    text: msg
  }
  ws.send(JSON.stringify(payload));
}

export const addListener = (listener) => {
  listeners.push(listener)
}
