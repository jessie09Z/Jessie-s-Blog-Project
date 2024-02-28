import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom"; // 导入 Link 组件
import axios from "axios";


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

async function handleRegister(event){
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
      console.log("created newUser");

      try {
        const response = await axios.post("http://localhost:5000/api/register", newUser);
        const data = response.data;
        
        if (data.success) {
        
          navigate("/login");
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
        <form onSubmit={handleRegister}>
        <h1>Register Page</h1>
        <label for="username">Username</label>
        <input type="text" onChange={handleChange} name="username" id="username" placeholder="username" value={registerInfo.username} required/>
        <label for="password">Password</label>
        <input type="password" onChange={handleChange} name="password" id="password" placeholder="password" value={registerInfo.password} required/>
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" onChange={handleChange} name="confirmPassword" id="confirmPassword" value={registerInfo.confirmPassword} placeholder="password" required/>
        <button type="submit">Register</button>

        </form>
    
        </div>
      );
}

export default Register;