import React from "react";
import ReactDOM from "react-dom";

import style from "./index.css";

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
    console.log(event.data);
  };
}

const Index = () => (
  <input type="button" onClick={dostuff} value="click" />
);

ReactDOM.render(<Index />, document.getElementById("index"));
