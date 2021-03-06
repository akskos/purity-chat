import React from "react";
import ReactDOM from "react-dom";

import Chat from "./chat.js"
import { init } from "./ws.js"
import './index.css'

window.onload = function() {
  init()
}

ReactDOM.render(<Chat />, document.getElementById("index"));
