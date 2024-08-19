import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register(props) {
    const [registerInfo, setRegisterInfo] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState(""); // Initial error state
    const navigate = useNavigate();

    function handleChange(event) {
        const { name, value } = event.target;
        setRegisterInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
        setError(""); // Clear error on input change
    }

    async function handleRegister(event) {
        event.preventDefault();
        console.log("Register button clicked");

        let shouldRegister = true;
        if (registerInfo.password.length < 6) {
            setError("Password should be at least 6 characters long");
            toast.error("Password should be at least 6 characters long");
            shouldRegister = false;
        } else if (registerInfo.password !== registerInfo.confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            shouldRegister = false;
        } else if (props.users.some(user => user.username === registerInfo.username)) {
            setError("Username already exists");
            toast.error("Username already exists");
            shouldRegister = false;
        }

        if (!shouldRegister) {
            return;
        }

        const newUser = {
            username: registerInfo.username,
            password: registerInfo.password
        };

        const baseURL = "https://jessieblogs-h5cqa6h3hmgpfhf8.australiaeast-01.azurewebsites.net";

        try {
            const response = await axios.post(`${baseURL}/api/register`, newUser);
            const data = response.data;

            if (data.success) {
                navigate("/login");
            } else {
                toast.error(data.message);
                setError(data.message); // Display server-side error
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please try again.");
            setError("An error occurred. Please try again."); // Display network error
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
                {error && (
                    <div className="form-group">
                        <p className="error-message">{error}</p>
                    </div>
                )}
                <div className="form-group">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
}

export default Register;