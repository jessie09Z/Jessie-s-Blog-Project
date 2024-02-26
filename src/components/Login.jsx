import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
function Login(props){
 
  const [loginInfo, setLoginInfo]=useState({
    username : "", 
    password:""
  })

  
  
 function handleChange(event){
  const {name, value}= event.target;
  setLoginInfo(prevState => ({
    ...prevState,
    [name]: value
  }));
 }
 const navigate = useNavigate();
  function handleSumbit(event){
    event.preventDefault();
    const foundUser = props.users.find(user => user.username === loginInfo.username);
    if (!foundUser) {
      alert(`Username ${loginInfo.username} not found`);
      return;
    }
    if (foundUser.password !== loginInfo.password) {
      alert("Incorrect password");
      return;
    }  
      props.onLogin(true);
      navigate("/allblogs");
  
  }
  
 
    return (
        <div>
        <form >
        <h1>Login Page</h1>
        <label for="username">Username</label>
        <input type="text" onChange={handleChange} name="username" id="username" placeholder="admin" value={loginInfo.username} required/>
        <label for="password">Password</label>
        <input type="password" onChange={handleChange} name="password" id="password" placeholder="123456" value={loginInfo.password} required/>
        <button onClick={handleSumbit}>Login</button>

        </form>
          
        <p>If you don't have an account, you can <Link to="/register">create a new account</Link>.</p>
        </div>
      );
}

export default Login;