import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function NewBlog(props) {
  // keep track the blog content
  const { username } = useParams();

  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    content: ""
  })
  function handleChange(event) {
    const { name, value } = event.target;
    setBlog(prevBlog => {
      return { ...prevBlog, [name]: value }
    })
  }
  async function submitBlog(event) {
    event.preventDefault();
    try {
      const newBlog = {
        title: blog.title,
        content: blog.content

      }
      const response = await axios.post(`http://localhost:5000/api/user/${username}/new`, newBlog);
      console.log(response, " insert respones");
      if (response.status === 200) {
        console.log(`/users/${username}/allblogs`, "check go back fine");
        navigate(`/users/${username}/allblogs`);
    } else {
        throw new Error("Failed to submit blog");
    }
    }
    catch (error) {
      console.log(error);
    }

  }
  return (
    <div className="center">
      <form className="create-blog" onSubmit={submitBlog}>
        <input onChange={handleChange}
          name="title"
          value={blog.title}
          placeholder="Blog Title"
        />

        <textarea
          name="content"
          onChange={handleChange}
          value={blog.content}
          placeholder="Please write blog content here..."
          rows="8"
        />
        <button type="submit" >Add</button>
      </form>
    </div>
  );
}

export default NewBlog;
