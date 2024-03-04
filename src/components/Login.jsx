import React, { useState , useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
function Login(props) {
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setLoginInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const navigate = useNavigate();
  

  async function handleSumbit(event) {
    event.preventDefault();
   
    try {
      //console.log("Username before submit:", loginInfo.username);
      const response = await axios.post("http://localhost:5000/api/login", loginInfo);
      const data = response.data;
      console.log(data, "check log");
      
      if (data.success) {
        props.onLogin(loginInfo.username, true); 
       // console.log(`/users/${loginInfo.username}/allblogs`);
       const newPath= `/users/${loginInfo.username}/allblogs`;
      // props.setCurrentPath(newPath);
       
        navigate(newPath);
      } else {
        console.log( "check log after false");

        toast.warning(
          <div>
            <p>Invalid username or password</p>
          </div>,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          }
        );
      }
    } catch (error) {
      console.error( error);
      toast.error("An error occurred. Please try again.");

      
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSumbit}>
        <h1>Login Page</h1>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            onChange={handleChange}
            name="username"
            id="username"
            placeholder="admin"
            value={loginInfo.username}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            onChange={handleChange}
            name="password"
            id="password"
            placeholder="123456"
            value={loginInfo.password}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Login</button>
        </div>
      </form>
      <div className="link-container">
        <p>
          If you don't have an account, you can <Link to="/register">create a new account</Link>.
        </p>
      </div>
    </div>
  );
}
export default Login;