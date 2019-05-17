import React from "react";
import { addListener, sendMessage } from "./ws.js";

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
      messages: [],
      inputTextValue: '',
    }
    addListener(this.addMessage);
		this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addMessage(text) {
    console.log('chat: ', text)
  }

  sendMessage(event) {
    console.log(event) 
  }

  handleChange(event) {
    this.setState({inputTextValue: event.target.value});
  }

  handleSubmit(event) {
    sendMessage(this.state.inputTextValue);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <p>chat component</p> 
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="speaketh thy mind..." onChange={this.handleChange} />
          <input type="submit" value="send" />
        </form>
      </div>
    )
  }
}
