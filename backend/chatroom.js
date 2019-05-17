const generateName = require('./nameGenerator');
const ChatClient = require('./chatClient');

class ChatRoom {
    constructor() {
        this.connections = [];
        this.messages = [];
    }

    sendAll(jsonMessage) {
        for (let chatClient of this.connections) {
            chatClient.ws.send(JSON.stringify(jsonMessage));
        }
    }
    
    onMessage(client, msg) {
        console.log('message received');
        try {
            let received = JSON.parse(msg);
            if (!received.type) {
                let message = {
                    type: "error",
                    text: "Invalid message format, should have type"
                }
                client.ws.send(message);
            }
            
            // React to different message types
            if (received.type == "msg") {
                let message = {
                    type: "msg",
                    sender: client.userName, 
                    text: received.text
                };
                this.messages.push({
                    sender: client.userName,
                    text: received.text
                });
                if (this.messages.length > 100) {
                    this.messages.shift();
                }
                this.sendAll(message);
            }

            if (received.type == "info") {
                let message = {
                    type: "info",
                    users: this.connections.map(user => {
                        return user.userName;
                    }),
                    messages: this.messages
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
        this.sendAll({
            type: "userConnected",
            userName: client.userName
        });
    }

    onDisconnect(ws) {
        console.log("User disconnected");
        let indexToRemove = -1
        for (let i in this.connections) {
            if (this.connections[i].ws === ws) {
                this.sendAll({
                    type: "userDisconnected",
                    userName: this.connections[i].userName
                });
                indexToRemove = i;
                break;
            }
        }

        this.connections.splice(indexToRemove, 1);
    }
}

module.exports = ChatRoom;