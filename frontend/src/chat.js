import React from "react";
import { addListener, sendMessage } from "./ws.js";
import './chat.css';
import backgroundImg from './assets/backgroundclouds.png';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      inputTextValue: '',
    }
		this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addMessage = this.addMessage.bind(this);
    addListener(this.addMessage);
  }

  addMessage(text) {
    this.setState({messages: [...this.state.messages, text]});
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
      </div>
    )
  }
}
