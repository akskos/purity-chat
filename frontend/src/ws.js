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

export const sendMsg = (msg) => {
  const payload = {
    type: 'msg',
    text: msg
  }
  ws.send(JSON.stringify(payload));
  ws.onmessage = function(event) {
    listeners.forEach(l => {
      l(event.data)
    });
  }
}

export const addListener = (listener) => {
  listeners.push(listener)
}
