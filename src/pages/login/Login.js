import React, {  useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const { currentUser,setCurrentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nickname = e.target[0].value;
    const password = e.target[1].value;
    
    try {
     const res= await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname, password }),
      })
      const data = await res.json();
      localStorage.setItem('currentUser', JSON.stringify({nickname:data.user.nickname,uid:data.user._id}));

       setCurrentUser(data.user)
   
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };


//   const handleTest =  ()=> {
    
//     fetch("http://localhost:4000/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ nickname:'test8', password:'aeeadsd' }),
//       })
//   .then((res) => res.json())
//   .then((res) => setCurrentUser(res.user))
//   .catch((err) => console.log(err));
// }
  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="register__name"></div>
        <div className="form__name">Login</div>
        <input required type="text" placeholder="Nickname" />
        <input required type="password" name="" id="" placeholder="Password" />
        <button>Log in</button>
        <div className="form__have-account">
          <span >  You</span> don't have an account?{" "}
          <Link to="/register">
            <span>Sign up</span>
          </Link>
        </div>
        {err && <span>{err}</span>}
      </form>
    </div>
  );
};

export default Login;
