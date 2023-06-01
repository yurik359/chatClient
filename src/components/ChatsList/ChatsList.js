import "./chatList.css";

import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../context/websocketContext";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const {
    userChat,
    sendMessageWs,
    isWebSocketOpen,
    lastCommonMessage,
    commonisTyping: { commIsTyping, commTypeNickname },
  } = useContext(WebSocketContext);

  const sortChatsByDate = (a, b) => {
    return b[1].date - a[1].date;
  };

  useEffect(() => {
    if (userChat) {
      setChats(userChat.chats);
    }
  }, [userChat]);

  useEffect(() => {
    console.log("change currentuser", isWebSocketOpen);

    currentUser.uid &&
      isWebSocketOpen &&
      sendMessageWs({ type: "getChats", payload: currentUser.uid });
  }, [currentUser && isWebSocketOpen]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const renderChatItem = (chat, i) => {
    const firstValue = Object.values(chat)[0];

    const chatName = firstValue?.userInfo?.nickname;
    const lastMessage =
      chatName === "common chat"
        ? lastCommonMessage
        : firstValue.lastMessage?.value;

    const isTyping = firstValue?.isTyping;
    const commonIsTyping =
      commIsTyping &&
      chatName === "common chat" &&
      currentUser.nickname !== commTypeNickname
        ? true
        : false;
    return (
      <div
        className="chat-item"
        key={i}
        onClick={() => handleSelect(firstValue)}
      >
        <div className="chat-item__name">{chatName}</div>
        <div
          className="chat-item__lastmes"
          style={{ display: isTyping || commonIsTyping ? "none" : "block" }}
        >
          {lastMessage}
        </div>
        <div
          style={{ display: isTyping || commonIsTyping ? "block" : "none" }}
        >{`${
          commonIsTyping ? commTypeNickname : isTyping ? chatName : null
        } is typing...`}</div>
      </div>
    );
  };

  return <div className="chat-list">{chats?.map(renderChatItem)}</div>;
};

export default ChatList;
