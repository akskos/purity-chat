import React from "react";
import { addListener } from "./ws.js";

const dostuff = () => {

  console.log("hello");
  const ws = new WebSocket('ws://localhost:8080');
  ws.onopen = function(event) {
    const payload = {
      type: 'msg',
      text: 'hello'
    }
    ws.send(JSON.stringify(payload))
  }
  ws.onmessage = function(event) {
    console.log('chat', event.data);
  };
}

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
    addListener(this.addMessage);
  }

  addMessage(text) {
    console.log('chat: ', text)
  }

  render() {
    return (
      <div>
        <p>chat component</p> 
        <input type="button" onClick={dostuff} value="click" />
      </div>
    )
  }
}
