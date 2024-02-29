import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateBlog(props) {
  const location = useLocation();
  const navigate=useNavigate();
  const { title: initialTitle, content: initialContent } = location.state || {};
  const { id, username } = useParams();
  const [blog, setBlog] = useState({
    title: initialTitle || "",
    content: initialContent || ""
  });
  useEffect(() => {
    // 根据博客ID从后端获取博客数据
    async function fetchBlog() {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${username}/blogs/${id}`);
        console.log("response from update reqirement");
        const blogData = response.data;
        setBlog(blogData);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    }

    fetchBlog();
  }, [id, username]);
  function handleChange(event) {
    const { name, value } = event.target;
    setBlog(prevBlog => ({
      ...prevBlog,
      [name]: value
    }));
  }
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:5000/api/user/${username}/blogs/${id}`, blog);
      console.log("Blog updated:", response.data);
      navigate(`/users/${username}/allblogs`)
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  }
  return (
    <div className="center">
   <h2 className="form-title">Update Blog</h2>
  <form className="create-blog" onSubmit={handleSubmit}>
    <input
      type="text"
      name="title"
      value={blog.title}
      onChange={handleChange}
      placeholder="Blog Title"
    />
    <textarea
      name="content"
      value={blog.content}
      onChange={handleChange}
      placeholder="Blog Content"
      rows="8"
    />
    <button type="submit">Update</button>
  </form>
</div>
  );
  
}

export default UpdateBlog;