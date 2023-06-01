import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import { WebSocketProvider } from "./context/websocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
    <WebSocketProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </WebSocketProvider>
    </ChatContextProvider>
  </AuthContextProvider>
);
