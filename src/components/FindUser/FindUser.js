import { useContext, useState } from "react";
import "./findUser.css";

import { AuthContext } from "../../context/AuthContext";

const FindUser = () => {
  const [nickName, setNickName] = useState("");
  const [user, setUser] = useState(false);
  const [err, setErr] = useState(false);
  const [noUser, setNoUser] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleFind = async () => {
    try {
      const res= await fetch("http://194.61.52.152:4000/findUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickName}),
      })
      const finedUser = await res.json();
      if (finedUser) {
        
        setUser(finedUser)
       
      } else {
        setNoUser(true)
      }
      
    } catch (err) {
      setErr(true);
    }
  };

  const handleSelectUser = async (user) => {
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
          finedUserInfo:{_id:user._id,nickname:user.nickname},
          currentUserInfo:{_id:currentUser.uid,nickname:currentUser.nickname}
        }),
      })
     
    } catch (err) {
      console.log(err);
    }
    setUser(null);
    setNickName("");
  };

  const handleKeyFind = (e) => {
    return e.key === "Enter" && handleFind();
  };

  return (
    <>
      <input
        className="find-user"
        value={nickName}
        onKeyDown={handleKeyFind}
        type="text"
        onChange={(e) => setNickName(e.target.value)}
        placeholder="Find a user"
      />
      {err && <div>Something went wrong</div>}
      {noUser && nickName !== "" && <div>User not found</div>}
      {user && (
        <div
          className="find-user__container"
          onClick={() => handleSelectUser(user)}
        >
          <div className="find-user__nickname">{user?.nickname}</div>
        </div>
      )}
    </>
  );
};

export default FindUser;
