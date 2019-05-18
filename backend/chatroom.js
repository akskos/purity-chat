const generateName = require('./nameGenerator');
const ChatClient = require('./chatClient');
const Nun = require('./nun');

class ChatRoom {
    constructor() {
        this.connections = [];
        this.messages = [];
        this.nun = new Nun((msg) => {
            let message = {
                type: "msg",
                sender: "overlord",
                text: msg
            };
            this.sendMessage(message);
        });
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
                // This updates the nun status and - if needed - edits the message.
                let filteredText = this.nun.reviseMessage(received.text);
                let message = {
                    type: "msg",
                    sender: client.userName, 
                    text: filteredText
                };

                this.sendMessage(message);
                
                this.sendAll(this.nun.getStatusMessage())
            }

            if (received.type == "info") {
                let message = this.getInfoMessage();
            }
        } catch (e) {
            console.warn(e.message);
        }
    }

    sendMessage(messageObj) {
        this.messages.push(messageObj);
        if (this.messages.length > 100) {
            this.messages.shift();
        }
        this.sendAll(messageObj);
    }

    onConnection(ws) {
        console.log('Connection received');
        var client = new ChatClient(ws, this.onDisconnect.bind(this)); 
        client.userName = generateName();
        this.connections.push(client);
        ws.on('message', (msg) => {
            this.onMessage(client, msg);
        });
        this.sendAll({
            type: "userConnected",
            userName: client.userName
        });
        client.ws.send(JSON.stringify(this.getInfoMessage()));

        // TODO: Check if connection is alive.
    }

    onDisconnect(ws) {
        console.log("User disconnected");
        ws.terminate();
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

    getInfoMessage() {
        return {
            type: "info",
            users: this.connections.map(user => {
                return user.userName;
            }),
            messages: this.messages,
            nun: this.nun.getStatusMessage()
        };
    }


}

module.exports = ChatRoom;