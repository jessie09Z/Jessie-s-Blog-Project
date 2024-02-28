import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import NewBlog from "./NewBlog";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import AllBlogs from "./AllBlogs";
import Login from "./Login";
import UpdateBlog from "./UpdateBlog";
import Register from "../Register";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(""); 
  function handleLogin( username,loggedIn) {
    setLoggedIn(loggedIn);
    setUsername(username); 
    console.log(loggedIn, "check login true or false");
    console.log(username, "username after login", loggedIn, "is loggedin");
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

  return (
    <Router>
      <div>
        <Header />
        <nav>
          <ul>
            {loggedIn && (
              <>
                <li>
                  <Link to={`/users/${username}/new` }>New Blog</Link>
                </li>
                <li>
                  <Link to={`/users/${username}/allblogs`}>All Blogs</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} users={users} />}
          />
          <Route
            path="/register"
            element={<Register onRegister={handleRegister} users={users} />}
          />

          {loggedIn ? (
            <>
              <Route
                 path="/users/:username/allblogs"
                element={<AllBlogs username={username} onDelete={deleteBlog} />}
              />
              <Route
                path="/users/:username/new"
                element={<NewBlog username={username} onAdd={AddBlog} onDelete={deleteBlog} />}
              />
              <Route path="/users/:username/updateBlog/:id" username={username} element={<UpdateBlog />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;