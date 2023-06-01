import { useState, useEffect, useRef } from "react";
import "./InputMessage.css";

import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

import { v4 as uuid } from "uuid";
import HeaderRight from "../HeaderRight/HeaderRight";
import { WebSocketContext } from "../../context/websocketContext";
const RightSide = () => {
  const { currentUser } = useContext(AuthContext);
  const [value, setValue] = useState("");
  const { data } = useContext(ChatContext);
  
  const [timerId, setTimerId] = useState(null);
  const timerRef = useRef(null);

  
  const { chatMessages, sendMessageWs, isWebSocketOpen, commonisTyping } =
    useContext(WebSocketContext);
  const ref = useRef();

  const sendMessage = async () => {
    if (value == "") {
      console.log("пусто");
    } else {
      try {
        setValue("");
        await fetch("http://localhost:4000/sendMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: data.chatId,
            message: {
              id: uuid(),
              value,
              senderId: currentUser.uid,
              date: Date.now(),
              nickname: currentUser.nickname,
            },
            usersInfo: {
              currentUserUid: currentUser.uid,
              user: {
                userUid: data.user.uid,
                userNickname: data.user.nickname,
              },
            },
          }),
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleTypingCancel = async () => {
    clearTimeout(timerRef.current);
    if (data.user.id == "common") {
      sendMessageWs({
        type: "changeCommonIsTyping",
        payload: {
          isTyping: true,
          nickname: currentUser.nickname,
        },
      });
    }
    sendMessageWs({
      type: "privateIsTyping",
      payload: {
        isTyping: true,
        nickname: currentUser.nickname,
        chatId: data.chatId,
        uid: data.user.uid,
      },
    });

    const id = setTimeout(async () => {
      if (data.user.id == "common") {
        sendMessageWs({
          type: "changeCommonIsTyping",
          payload: {
            isTyping: false,
            nickname: "",
          },
        });
      }

      sendMessageWs({
        type: "privateIsTyping",
        payload: {
          isTyping: false,
          nickname: "",
          chatId: data.chatId,
          uid: data.user.uid,
        },
      });
      setTimerId(null);
    }, 2000);
    timerRef.current = id;
    setTimerId(id);
  };

  const handleKeyDonw = async (e) => {
    if (e.key !== "Enter") {
      handleTypingCancel();
    }

    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  
  useEffect(() => {
    if (data.chatId) {
      isWebSocketOpen &&
        sendMessageWs({ type: "getMessages", payload: data.chatId });
    }
  }, [data.chatId]);

  return (
    <div className="right-side">
      <div className="message-area">
        <HeaderRight
          
        />
        <div className="message-area__messages">
          {chatMessages?.messages.map((m) => {
            return (
              <div
                className="message-container"
                key={uuid()}
                ref={ref}
                style={{
                  alignSelf:
                    currentUser.uid == m.senderId ? "flex-end" : "flex-start",
                }}
              >
                <div className="message-time"></div>
                <div className="message-name">{m.nickname}</div>
                <div className="message-text">{m.value}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="input-message">
        <input
          type="text"
          placeholder="Type something..."
          value={value}
          onKeyDown={handleKeyDonw}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="input-message__btn" onClick={sendMessage}>
          SEND
        </div>
      </div>
    </div>
  );
};

export default RightSide;
