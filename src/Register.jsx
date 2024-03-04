import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom"; // 导入 Link 组件
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
    let shouldRegister = true;
    if (registerInfo.password.length < 6) {
        setError("Password should be at least 6 characters long");
        toast.error("Password should be at least 6 characters long");
        shouldRegister=false;
        return;
      }
      if (registerInfo.password !== registerInfo.confirmPassword) {
        setError("Passwords do not match");
        toast.error("Passwords do not match");
        shouldRegister=false;
        return;
      }
      const isUsernameDuplicate = props.users.some(user => user.username === registerInfo.username);
  console.log("isUsernameDuplicate:", isUsernameDuplicate);

  if (isUsernameDuplicate) {
    setError("Username already exists");
    toast.error("Username already exists");
    shouldRegister=false;
    return;
  }
  if (!shouldRegister) {
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
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again.");
      }
         

}
    return (
      <div className="form-container">
      <form onSubmit={handleRegister}>
        <h1>Register Page</h1>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            onChange={handleChange}
            name="username"
            id="username"
            placeholder="username"
            value={registerInfo.username}
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
            placeholder="password"
            value={registerInfo.password}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            onChange={handleChange}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="confirm password"
            value={registerInfo.confirmPassword}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Register</button>
        </div>
      
      </form>
    </div>
      );
}

export default Register;