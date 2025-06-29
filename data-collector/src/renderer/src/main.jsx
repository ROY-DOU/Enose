import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/index.css";
import App from "./App";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

ReactDOM.createRoot(document.getElementById("root")).render(
  <FluentProvider theme={webLightTheme}>
    <App />
  </FluentProvider>
);
