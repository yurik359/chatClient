import { useState, useContext, useEffect } from "react";

import "./register.css";

import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  useEffect(() => console.log(currentUser), [currentUser]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nickname = e.target[0].value;
    const password = e.target[1].value;

    try {
      const res = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname, password }),
      });

      const data = await res.json();

      localStorage.setItem(
        "currentUser",
        JSON.stringify({ nickname: data.user.nickname, uid: data.user._id })
      );
      setCurrentUser({ nickname: data.user.nickname, uid: data.user._id });

      navigate("/");
    } catch (err) {
      setErr(err.message);
    }
  };
  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="form__name">Register</div>
        <input required type="text" placeholder="Nickname" />
        <input required type="password" placeholder="Password" />
        <button>Sign up</button>
        <div className="form__have-account">
          Are you already have account?{" "}
          <Link to="/login">
            <span>Log in</span>
          </Link>
        </div>
        {err && <span>{err}</span>}
      </form>
    </div>
  );
};

export default Register;
