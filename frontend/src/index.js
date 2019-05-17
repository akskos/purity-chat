import React from "react";
import ReactDOM from "react-dom";
import WS from "ws";

import style from "./index.css";

const dostuff = () => {
  console.log("hello");
  const ws = new WS("localhost:8080");
  ws.on('open', function open() {
    const payload = {
      type: 'msg',
      text: 'hello'
    }
    ws.send(JSON.stringify(payload))
  });
  ws.on('message', function incoming(data) {
    console.log(data);
  });
}

const Index = () => (
  <input type="button" onClick={dostuff} value="click" />
);

ReactDOM.render(<Index />, document.getElementById("index"));
