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
    addListener(this.addMessage);
  }

  addMessage(message) {
    switch (message.type) {
    case 'msg':
      const text = message.text;
      this.setState({messages: [...this.state.messages, text]});
      break;
    case 'userConnected':
      const uname = message.userName;
      const connectionText = `${uname} has joined`;
      this.setState({messages: [...this.state.messages, connectionText]})
      break;
    default:
      break;
    } 
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
        {this.state.messages.map((item, key) =>
          <p className="testClass" key={key}>{item}</p>
        )}
        <img id="nun" src={this.state.nun}></img>
      </div>
    )
  }
}
