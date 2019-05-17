const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8080,
});

let connections = [];

function onMessage(msg) {
    console.log("message received");
    for (let ws of connections) {
        ws.send('message received, pray to read it');
    }
}

function onConnection(ws) {
    console.log("Connection received");
    connections.push(ws);
    ws.on('message', onMessage);
    ws.send('connected');
}

wss.on('connection', onConnection);