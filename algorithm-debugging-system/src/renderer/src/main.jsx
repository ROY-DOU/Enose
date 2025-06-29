import React from "react";
import "./assets/index.css";
import ReactDOMClient from "react-dom/client";
import App from "./App";
import { FluentProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components";

ReactDOMClient.createRoot(document.getElementById("root")).render(
  <FluentProvider theme={webDarkTheme}>
    <App />
  </FluentProvider>
);
