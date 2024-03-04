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
  const [blogsChanged, setBlogsChanged] = useState(0); 
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
    if (username) {
      fetchUserBlogs();
    }
  }, [username, blogsChanged]); 
  useEffect(() => {

    localStorage.setItem("currentPath", `/users/${username}/allblogs`);
  }, [username]);
  async function handleDelete(id) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/user/${username}/blogs/${id}`);
      if (response.status === 200) {
        const updatedBlogs = userBlogs.filter((blog) => blog.id !== id);
        setUserBlogs(updatedBlogs);
        setBlogsChanged((prev) => prev + 1); 
        console.log("Blog deleted correctly");
        
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
            id={BlogItem.blogid}
            title={BlogItem.title}
            content={BlogItem.content}
            username={username}
            onDelete={() => handleDelete(BlogItem.blogid)}
          />
        );
      })}
    </div>
  );
}

export default AllBlogs;