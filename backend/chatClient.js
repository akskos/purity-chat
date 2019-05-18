const pingRate = 6000;

class ChatClient {
    constructor(wsArg, onDisconnect) {
        this.userName = '';
        this.ws = wsArg;
        this.onDisconnectCb = onDisconnect;
        this.alive = true;
        this.reputation = 5;
        this.pingInterval = setInterval(() => {
            if (!this.alive) {
                this.disconnect();
            }
            this.alive = false;
            this.ws.ping();
        }, pingRate);

        this.ws.on('pong', () => {
            this.alive = true;
        });
    }

    disconnect() {
        clearInterval(this.pingInterval);
        this.onDisconnectCb(this.ws);
    }
}

module.exports = ChatClient;