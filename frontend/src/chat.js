import React from "react";
import uuid from "uuid/v4";
import { addListener, sendMessage } from "./ws.js";
import './chat.css';
import nun1 from './assets/nun1.png';
import nun3 from './assets/nun3.png';
import nun4 from './assets/cryingnun.gif';
import nun5 from './assets/nun5.png';
import nun6 from './assets/shame.gif';

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
    case 'info':
      console.log('got info');
      const messages = message.messages.map(m => {
        if (m.type === 'msg') {
          return this.buildMessage(m.text, m.sender); 
        }
      });
      this.setState({messages});
      const users = message.users; 
      const usersText = `${users.join(' ')} are discussing`;
      const usersMsg = this.buildMessage(usersText, message.sender);
      this.setState({messages: [...this.state.messages, usersMsg]});
      const initialAngerLevel = message.nun.anger;
      this.setState({nun: this.mapAngerLevelToImage(initialAngerLevel)});
      break;
    case 'msg':
      const msg = this.buildMessage(message.text, message.sender);
      this.setState({messages: [...this.state.messages, msg]})
      break;
    case 'userConnected':
      const connectionText = `${message.userName} has joined`;
      const connMsg = this.buildMessage(connectionText, message.sender)
      this.setState({messages: [...this.state.messages, connMsg]})
      break;
    case 'excommunicated':
      const excommunicationText = `${message.userName} has been excommunicated!`;
      const excommunicationMsg = this.buildMessage(excommunicationText, "overlord")
      this.setState({messages: [...this.state.messages, excommunicationMsg]})
      break;
    case 'userDisconnected':
      const disconText = `${message.userName} has turned their back on God`;
      const disconMsg = this.buildMessage(disonText, "overlord")
      this.setState({messages: [...this.state.messages, disconMsg]})
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
      return nun5;
      break;
    case 3:
      return nun4;
      break;
    case 4:
      return nun6;
      break;
    case 5:
      return nun7;
      break;
    default:
      break;
    } 
  }

  componentDidUpdate() {
    const chatbox = document.getElementById("chatbox");
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  buildMessage(text, sender) {
    return {
      id: uuid(),
      text,
      sender: sender ? sender : "The Voice Above",
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
    this.setState({inputTextValue: ""});
    document.getElementById("textInput").value = "";
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input id="textInput" type="text" placeholder="speaketh thy mind..." onChange={this.handleChange} />
          <input type="submit" value="send" />
        </form>
        <div className="center" id="chatbox">
          {this.state.messages.map(item => {
            let text = `${item.sender}: ${item.text}`;
            return {
              text,
              id: item.id 
            };
          }).map((msg, key) =>
            <p className="testClass" id={msg.id} key={key}>{msg.text}</p>
          )}
        </div>
        <img id="nun" src={this.state.nun}></img>
      </div>
    )
  }
}
