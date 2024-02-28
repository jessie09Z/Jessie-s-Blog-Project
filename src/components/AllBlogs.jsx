import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import NewBlog from "./NewBlog";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import { Switch } from "react-router-dom";
import Blog from "../Blog";
import Login from "./Login";
import UpdateBlog from "./UpdateBlog";

import axios from "axios";

function AllBlogs(props) {
  const [userBlogs, setUserBlogs] = useState([]);
  let { username } = useParams();

  useEffect(() => {
    async function fetchUserBlogs() {
      try {
       
        const response = await axios.get(`http://localhost:5000/api/user/${username}/blogs`);
        const blogs = response.data;
        setUserBlogs(blogs);
      } catch (error) {
        console.error("Error fetching user blogs:", error);
      }
    }
if(username){ fetchUserBlogs();}
   
  }, [username, userBlogs]); 

  function handleDeleteClick(id) {
    props.onDelete(id);
  }
  async function handleDelete(id) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/user/${username}/blogs/${id}`);
      if (response.status === 200) {
        const updatedBlogs = userBlogs.filter((blog) => blog.id !== id);
        console.log("delete correctly");
        setUserBlogs(updatedBlogs);
      } else {
        console.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  }


  return (
    <div>

{userBlogs.map((BlogItem) => {
        return (
          <Blog
            key={BlogItem.blogid}
            id={BlogItem.blogid} // 使用实际的id值
            title={BlogItem.title}
            content={BlogItem.content}
            username={username}
            onDelete={handleDelete} // 将删除函数传递给子组件
          />
        );
      })}

    </div>
  );
}

export default AllBlogs;