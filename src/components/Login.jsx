import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

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
      console.log("Username before submit:", loginInfo.username);
      const response = await axios.post("http://localhost:5000/api/login", loginInfo);
      const data = response.data;
      console.log(data);
      
      if (data.success) {
        props.onLogin(loginInfo.username, true); 
        console.log(`/users/${loginInfo.username}/allblogs`);
        navigate(`/users/${loginInfo.username}/allblogs`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSumbit}>
        <h1>Login Page</h1>
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
        <button type="submit">Login</button>
      </form>
      <p>
        If you don't have an account, you can <Link to="/register">create a new account</Link>.
      </p>
    </div>
  );
}

export default Login;