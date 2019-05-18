const pingRate = 6000;

class ChatClient {
    constructor(wsArg, onDisconnect) {
        this.name = '';
        this.ws = wsArg;
        this.onDisconnectCb = onDisconnect;
        this.alive = true;
        this.pingInterval = setInterval(() => {
            if (!this.alive) {
                clearInterval(this.pingInterval);
                this.onDisconnectCb(this.ws);
            }
            this.alive = false;
            this.ws.ping();
        }, pingRate);

        this.ws.on('pong', () => {
            this.alive = true;
        });
    }
}

module.exports = ChatClient;