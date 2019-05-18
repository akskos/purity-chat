import config from './config'

let ws;
let listeners = [];

export const init = () => {
  ws = new WebSocket(config.server);
  ws.onmessage = function(event) {
    console.log(event)
    listeners.forEach(l => {
      const parsedData = JSON.parse(event.data);
      l(parsedData)
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
