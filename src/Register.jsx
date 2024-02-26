import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom"; // 导入 Link 组件


function Register(props){
    const[registerInfo, setRegisterInfo] = useState({
        username: undefined,
        password:undefined, 
        confirmPassword:undefined

    })

const[error, setError] = useState("");
const navigate = useNavigate();
function handleChange(event){
    const {name, value}=event.target;
    setRegisterInfo(preLoginInfo =>({
        ...preLoginInfo,
        [name]:value
    }))

}

function handleRegister(event){
    event.preventDefault();
    console.log("Register button clicked");
    if (registerInfo.password.length < 6) {
        setError("Password should be at least 6 characters long");
        alert("Password should be at least 6 characters long");
        return;
      }
      if (registerInfo.password !== registerInfo.confirmPassword) {
        setError("Passwords do not match");
        alert("Passwords do not match");
        return;
      }
      if (props.users.some(user => user.username === registerInfo.username)) {
        setError("Username already exists");
        alert("Username already exists");
        return;
      }
      const newUser = {
        username: registerInfo.username,
        password: registerInfo.password
      };
      console.log("created newUser")
      props.onRegister(newUser);
      console.log("created newUser", newUser);
      navigate("/login");    

}
    return (
        <div>
        <form >
        <h1>Register Page</h1>
        <label for="username">Username</label>
        <input type="text" onChange={handleChange} name="username" id="username" placeholder="username" value={registerInfo.username} required/>
        <label for="password">Password</label>
        <input type="password" onChange={handleChange} name="password" id="password" placeholder="password" value={registerInfo.password} required/>
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" onChange={handleChange} name="confirmPassword" id="confirmPassword" value={registerInfo.confirmPassword} placeholder="password" required/>
        <button onClick={handleRegister}>Register</button>

        </form>
    
        </div>
      );
}

export default Register;