// WebSocket.js

import React, { createContext, useEffect, useState, useRef } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
const WebSocketContext = createContext();

function WebSocketProvider({ children }) {
  const [userChat, setUserChat] = useState(null);
  const [chatMessages, setChatMessages] = useState(null);
  const [commonisTyping, setcommonisTyping] = useState(false);
  const [ws, setWebSocket] = useState();
  const [isWebSocketOpen, setWebSocketOpen] = useState(false);
  const [lastCommonMessage, setLastCommonMessage] = useState(null);
  const wsRef = useRef(null);
  useEffect(() => {
    const newWebSocket = new ReconnectingWebSocket("ws://localhost:4000");
    wsRef.current = newWebSocket;
    setWebSocket(newWebSocket);
    newWebSocket.addEventListener("open", () => {
      console.log("WebSocket connected");
      setWebSocketOpen(true);
    });

    newWebSocket.addEventListener("message", (event) => {
      const res = JSON.parse(event.data);
      
      if (res) {
        if (res.hasOwnProperty("chats")) {
          setUserChat(res);
        } else if (res.hasOwnProperty("messages")) {
          setChatMessages(res);
        } else if (res.hasOwnProperty("commIsTyping")) {
          setcommonisTyping(res);
        } else if (res.hasOwnProperty("lastMessage")) {
          setLastCommonMessage(res.lastMessage.value);
        }
      }
    });
  }, []);

  const sendMessageWs = (message) => {
    const ws = wsRef.current;

    ws.send(JSON.stringify(message));
  };
  const valueWs = {
    userChat,
    chatMessages,
    sendMessageWs,
    isWebSocketOpen,
    commonisTyping,
    lastCommonMessage,
  };

  return (
    <WebSocketContext.Provider value={valueWs}>
      {children}
    </WebSocketContext.Provider>
  );
}

export { WebSocketContext, WebSocketProvider };
