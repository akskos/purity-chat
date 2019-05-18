var fs = require('fs');
var readline = require('readline');

const minAnger = 0;
const maxAnger = 4;

class Nun {
    constructor(talkCallbackArg) {
        this._anger = minAnger;
        this.cursewords = [];
        this.holyWords = [];
        this.readWordLists();
        this.talkCallback = talkCallbackArg;
    }

    readWordLists() {
        let curseLines = readline.createInterface({
            input: fs.createReadStream('./data/curseWords.txt')
        });
        curseLines.on('line', (line)=> {
            this.cursewords.push(line);
        });

        let holyLines = readline.createInterface({
            input: fs.createReadStream('./data/holyWords.txt')
        });
        holyLines.on('line', (line)=> {
            this.holyWords.push(line);
        });
    }

    // React to the message by updating the state
    reviseMessage(messageText) {
        let cleanMessage = messageText.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+\r]/g, '').replace(/\s{2,}/g," ");

        let curses = [];
        let holies = [];
        for (let word of cleanMessage.split(' ')) {
            if (this.cursewords.includes(word)) {
                curses.push(word);
            }
            if (this.holyWords.includes(word)) {
                holies.push(word);
            }
        }

        if (curses.length == 0) {
            this.anger -= 0.2;
        }
        this.anger -= Math.min(0.5, holies.length * 0.1);
        this.anger += Math.min(1.5, curses.length * 0.4);

        if (curses.length > 0) {
            this.talk("Careful with " + curses.join(', '), Math.random(2000));
        }

        if (holies.length > 1) {
            this.talk("Blessed be those who talk like angels.", Math.random(2000));
        }

        return messageText;
    }

    getStatusMessage() {
        return {
            type: "nunStatus",
            anger: Math.round(this.anger)
        }
    }

    // Talk in the chat
    talk(msgText, delay) {
        if (!this.talkCallback) { throw 'Nun cannot talk, it does not have a talk callback!'; }

        setTimeout(() => {this.talkCallback(msgText)}, delay);
    }

    set anger(value) {
        this._anger = Math.min(maxAnger, Math.max(minAnger, value));
    }

    get anger() { return this._anger; }
}

module.exports = Nun;