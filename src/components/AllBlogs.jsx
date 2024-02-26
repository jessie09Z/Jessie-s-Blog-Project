import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import NewBlog from "./NewBlog";
import { BrowserRouter as Router, Route, Routes,Link } from "react-router-dom";
import { Switch } from "react-router-dom";
import Blog from "../Blog";
import Login from "./Login";
import UpdateBlog from "./UpdateBlog";

function AllBlogs(props) { 
  function handleDeleteClick(id) {
    props.onDelete(id);
  }

    return (
        <div>
         
          {props.blogs.map((BlogItem, index) => {
            return (
              <Blog
                key={index}
                id={index}
                title={BlogItem.title}
                content={BlogItem.content}
                handleDelete={() => handleDeleteClick(index)} // Pass the index to handleClick
            onDelete={props.onDelete} // Pass onDelete from props directly
              />
            );
          })}
          
        </div>
      );
}

export default  AllBlogs;