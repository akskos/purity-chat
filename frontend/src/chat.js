import React from "react";
import { addListener, sendMessage } from "./ws.js";
import './chat.css';
import nun1 from './assets/nun1.png';
import nun3 from './assets/nun3.png';
import nun4 from './assets/nun4.png';
import nun5 from './assets/nun5.png';
import nun6 from './assets/nun6.png';

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
    this.mapAngerLevelToImage = this.mapAngerLevelToImage.bind(this);
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
    case 'nunStatus':
      const angerLevel = message.anger;
      this.setState({nun: this.mapAngerLevelToImage(angerLevel)});
      break;
    default:
      break;
    } 
  }

  mapAngerLevelToImage(level) {
    switch (level) {
    case 0:
      return nun1;
      break;
    case 1:
      return nun3;
      break;
    case 2:
      return nun4;
      break;
    case 3:
      return nun5;
      break;
    case 4:
      return nun6;
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
