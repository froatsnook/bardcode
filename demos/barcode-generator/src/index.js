import "babel-polyfill";
import React from "react";
import { render } from "react-dom";

import "./index.html";
import "./style.css";

import App from "./app";

const app = document.getElementById("app");
render(
  <App />,
  app,
  () => {

  }
);

