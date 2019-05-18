const WebSocket = require('ws');

const ChatRoom = require('./chatroom');

const wss = new WebSocket.Server({
    port: 8080,
});

process.chdir(__dirname);

let chatroom = new ChatRoom();

wss.on('connection', chatroom.onConnection.bind(chatroom));
wss.on('close', chatroom.onDisconnect.bind(chatroom));

console.log('Chat server running on port ' + wss.address().port);