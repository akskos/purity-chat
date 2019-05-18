import React from "react";
import { addListener, sendMessage } from "./ws.js";
import './chat.css';
import nun1 from './assets/nun1.png';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      inputTextValue: '',
      nun: nun1,
    }
		this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.buildMessage = this.buildMessage.bind(this);
    addListener(this.addMessage);
  }

  addMessage(message) {
    switch (message.type) {
    case 'msg':
      const msg = this.buildMessage(message.text, message.sender);
      this.setState({messages: [...this.state.messages, msg]})
      break;
    case 'userConnected':
      const connectionText = `${message.userName} has joined`;
      const connMsg = this.buildMessage(connectionText, message.sender)
      this.setState({messages: [...this.state.messages, connMsg]})
      break;
    default:
      break;
    } 
  }

  buildMessage(text, sender) {
    return {
      text,
      sender: sender ? sender : 'angel',
    };
  }

  sendMessage(event) {
    console.log(event) 
  }

  handleChange(event) {
    this.setState({inputTextValue: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    sendMessage(this.state.inputTextValue);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="speaketh thy mind..." onChange={this.handleChange} />
          <input type="submit" value="send" />
        </form>
        {this.state.messages.filter(m => m.sender !== 'overlord').map((item, key) =>
          <p className="testClass" key={key}>{item.text}</p>
        )}
        {this.state.messages.filter(m => m.sender === 'overlord').map((item, key) =>
          <p className="testClass" key={key}>NUN: {item.text}</p>
        )}
        <img id="nun" src={this.state.nun}></img>
      </div>
    )
  }
}
