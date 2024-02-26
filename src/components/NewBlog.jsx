import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewBlog(props){
    // keep track the blog content
    const navigate = useNavigate();
    const [blog, setBlog]= useState({
        title: "", 
        content: ""
    })
    function handleChange(event){
        const {name, value}= event.target;
        setBlog(prevBlog=>{
            return {...prevBlog, [name]: value}
        })
    }
    function submitBlog(event){
        event.preventDefault();
        props.onAdd(blog);
        setBlog({
            title: "", 
            content: ""
        })
        navigate("/allblogs");
    }
    return (
        <div className="center">
          <form className="create-blog">
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
            <button onClick={submitBlog} >Add</button>
          </form>
        </div>
      );
}

export default NewBlog;
