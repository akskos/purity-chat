import React from "react";
import ReactDOM from "react-dom";

import style from "./index.css";
import Chat from "./chat.js"
import { init } from "./ws.js"

window.onload = function() {
  init()
}

ReactDOM.render(<Chat />, document.getElementById("index"));
