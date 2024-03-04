import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import NewBlog from "./NewBlog";
import { HashRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import AllBlogs from "./AllBlogs";
import Login from "./Login";
import UpdateBlog from "./UpdateBlog";
import Register from "../Register";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBookOpen, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router'

const AuthContext = React.createContext();

function App() {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [currentPath, setCurrentPath] = useState(window.location.hash);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedLoggedIn = localStorage.getItem("loggedIn");
  
    if (!storedUser || storedLoggedIn !== "true") {
      setLoggedIn(false);
      setUsername("");
      setCurrentPath(window.location.hash);
      console.log("No user found in local storage or not logged in");
    } else {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
      setLoggedIn(true);
      setCurrentPath(`/users/${user.username}/allblogs`);
    }
    setChecking(false); 
  }, []);

  function handleLogin(username, loggedIn) {
    localStorage.setItem("user", JSON.stringify({ username }));
    localStorage.setItem("loggedIn", loggedIn ? "true" : "false");
    setUsername(username);
    setLoggedIn(loggedIn);
    if (loggedIn) {
      setCurrentPath(`/users/${username}/allblogs`);
    }
  }

  function AddBlog(newBlog) {
    setBlogs((prevBlogs) => {
      return [...prevBlogs, newBlog];
    });
  }

  function handleRegister(newUser) {
    setUsers((prevUsers) => {
      return [...prevUsers, newUser];
    });
  }

  function deleteBlog(id) {
    setBlogs((prevBlogs) => {
      return prevBlogs.filter((BlogItem, index) => {
        return index !== id;
      });
    });
  }

  function handleLogout() {
    let isConfirmed = false;

    const handleClose = () => {
      if (isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("currentPath");
        setLoggedIn(false);
        setUsername("");
        console.log("User logged out");
      }
    };

    toast.warning(
      <div>
        <p>Are you sure you want to log out?</p>
        <button className="logout-btn" onClick={() => {
          isConfirmed = true;
          handleClose();
          toast.dismiss();
        }}>
          Confirm
        </button>
      </div>,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: handleClose,
      }
    );
  }

  if (checking) {
   
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ loggedIn, handleLogin, handleLogout }}>
      <Router>
        <div>
          <Header />
          <nav className="navbar">
            <ul className="navbar-nav">
              {loggedIn && (
                <>
                  <li className="nav-item">
                    <Link to={`/users/${username}/new`} className="nav-link"><FontAwesomeIcon icon={faPlus} className="nav-icon" />New Blog</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={`/users/${username}/allblogs`} className="nav-link"> <FontAwesomeIcon icon={faBookOpen} className="nav-icon" /> All Blogs</Link>
                  </li>
                  <li className="nav-item">
                    <button className="logout-btn" onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} />Logout</button>
                    <ToastContainer />
                  </li>
                </>
              )}
            </ul>
          </nav>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} users={users} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} users={users} />} />
            
            {loggedIn ? (
              <>
                <Route path="/users/:username/allblogs" element={<AllBlogs username={username} onDelete={deleteBlog} currentPath={currentPath} />} />
                <Route path="/users/:username/new" element={<NewBlog username={username} onAdd={AddBlog} onDelete={deleteBlog} currentPath={currentPath} />} />
                <Route path="/users/:username/updateBlog/:id" element={<UpdateBlog username={username} currentPath={currentPath} />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
          <Footer className="footer" />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;