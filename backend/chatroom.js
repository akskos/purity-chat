const generateName = require('./nameGenerator');
const ChatClient = require('./chatClient');

class ChatRoom {
    constructor() {
        this.connections = [];
    }
    
    onMessage(client, msg) {
        console.log('message received');
        try {
            let received = JSON.parse(msg);
            if (received.type && received.type == "msg") {
                let message = {
                    type: "msg",
                    sender: client.userName, 
                    text: received.text
                }
                for (let chatClient of this.connections) {
                    chatClient.ws.send(JSON.stringify(message));
                }
            }
        } catch (e) {
            console.warn(e.message);
        }
    }

    onConnection(ws) {
        console.log('Connection received');
        var client = new ChatClient(ws); 
        client.userName = generateName();
        this.connections.push(client);
        ws.on('message', (msg) => {
            this.onMessage(client, msg);
        });
        ws.send(client.userName + ' connected');
    }

    onDisconnect(ws) {
        this.connections = this.connections.filter(client => {
            return client.ws !== ws;
        });
    }
}

module.exports = ChatRoom;