import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import style from "./index.css";

const dostuff = () => {
  console.log("hello");
}

const Index = () => (
  <input type="button" onClick={dostuff} value="click" />
);

ReactDOM.render(<Index />, document.getElementById("index"));
