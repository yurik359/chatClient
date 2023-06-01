import { useContext, useEffect, useState } from "react";
import "./headerRight.css";
import { ChatContext } from "../../context/ChatContext";

import { AuthContext } from "../../context/AuthContext";

import { WebSocketContext } from "../../context/websocketContext";

const HeaderRight = () => {
  const { data } = useContext(ChatContext);
  const { commonisTyping } = useContext(WebSocketContext);
  const { currentUser } = useContext(AuthContext);
  const [members, setMember] = useState(null);
  const [closeMemList, setCloseMemList] = useState(false);

  

  const handleMembersList = async () => {
    try {
      const res = await fetch("http://194.61.52.152:4000/getMemberList");
      const data = await res.json();
      const clearedData = data.documents.filter((e) => e.nickname && e._id);
      setMember(clearedData);
      setCloseMemList(false);
    } catch (err) {
      new Error(err);
    }
  };

  const handleSelectUser = async (user) => {
    if (user.uid == currentUser.uid) return;
    const combinedId =
      currentUser.uid > user._id
        ? currentUser.uid + user._id
        : user._id + currentUser.uid;

    try {
      await fetch("http://194.61.52.152:4000/selectUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          combinedId,
          finedUserInfo: { _id: user._id, nickname: user.nickname },
          currentUserInfo: {
            _id: currentUser.uid,
            nickname: currentUser.nickname,
          },
        }),
      });
    } catch (err) {
      console.log("Add chat error:", err);
    }
  };
  const handleClickOutside = (e) => {
    if (
      !e.target.classList.contains("header-right__member-list") &&
      !e.target.classList.contains("header-right__btn")
    ) {
      setCloseMemList(true);
    }
  };
  useEffect(() => {
    document.body.addEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="header-right">
      <div className="header-right__title">
        <div className="header-right__name-chat">{data.user?.nickname}</div>

        {commonisTyping.commIsTyping && data.chatId == "common" && (
          <span
            style={{
              display:
                commonisTyping.commTypeNickname == currentUser.nickname
                  ? "none"
                  : "block",
            }}
          >
            {commonisTyping.commTypeNickname} is typing...
          </span>
        )}
      </div>

      <div className="header-right__container">
        <div
          className="header-right__btn"
          onClick={handleMembersList}
          style={{
            display: data.user.nickname == "common chat" ? "block" : "none",
          }}
        >
          members list
        </div>
        <div
          className="header-right__member-list"
          style={{ display: closeMemList ? "none" : "block" }}
        >
          {members &&
            members
              .filter((e) => e.nickname !== "common chat")
              .map((e) => {
                return (
                  <div
                    className="member-list__item"
                    onClick={() => handleSelectUser(e)}
                    key={e._id}
                  >
                    {e.nickname}
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default HeaderRight;
