import React from "react";
import { Link } from "react-router-dom";

function Blog(props) {
    function handleDeleteClick() {
        props.handleDelete(props.id);
      }

  return (
    <div className="blog">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <Link to={`/updateBlog/${props.id}`}>
        <button onClick={props.onClick}>Update</button>
      </Link>
      <button onClick={handleDeleteClick}>DELETE</button>
      
      
    </div>
  );
}

export default Blog;

