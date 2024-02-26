import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import NewBlog from "./NewBlog";
import { BrowserRouter as Router, Route, Routes,Link,Navigate } from "react-router-dom";
import { Switch } from "react-router-dom";
import AllBlogs from "./AllBlogs";
import Login from "./Login";
import UpdateBlog from "./UpdateBlog";
import Register from "../Register";
import axios from "axios";

function App() {

  const [users, setUsers] = useState([{
    username: "",
    password: ""
  }
   
  ]);  //use an array to keep track all registered users. 
  const [blogs, setBlogs]=useState([]);  //use an array to keep track all blogs

  const [loggedIn, setLoggedIn] = useState(false);
  function handleLogin(isLoggedIn) {
    setLoggedIn(isLoggedIn);
  }
  function AddBlog(newBlog){
    setBlogs(
   (prevBlogs)=>{
  return [...prevBlogs, newBlog];
      }
    )
  
  }
  function handleRegister(newUser){

    setUsers(
   (prevUsers)=>{
  return [...prevUsers, newUser];
      }
    )
  }
  function deleteBlog(id) {
    setBlogs(prevBlogs => {
      return prevBlogs.filter((BlogItem, index) => {
        return index !== id;
      });
    });
  }

  async function LoginCheck(loginInfo){
    try{
const response = await axios.post("/api/login",loginInfo)
const data= response.data;
console.log(data)

    }
    catch(error){

    }
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
                  <Link to="/new">New Blog</Link>
                </li>
                <li>
                  <Link to="/allblogs">All Blogs</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
<Routes>
<Route path="/login" element={<Login onLogin={handleLogin}  users={users}/>} />
<Route path="/register" element={<Register onRegister={handleRegister} users={users}/>} /> 
        
{loggedIn ? (
            <>
              <Route path="/allblogs" element={<AllBlogs blogs={blogs} onDelete={deleteBlog} />} />
              <Route path="/new" element={<NewBlog onAdd={AddBlog} onDelete={deleteBlog} />} />
              <Route path="/updateBlog/:id" element={<UpdateBlog />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
   
      </Routes>
    
  
  <Footer />
      </div>
</Router>)
}

export default App;
