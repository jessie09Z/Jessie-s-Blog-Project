import React from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";


function Blog(props) {
  const navigate = useNavigate();
  async function handleDelete() {
    const { id, username, onDelete } = props;
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/user/${username}/blogs/${id}`);
        console.log(`http://localhost:5000/api/user/${username}/blogs/${id}`);
        console.log(response, "delete response");
        if (response.status === 200) {
       console.log("delete sucess, wait for go back to allblogs");
          onDelete(id);
          navigate(`/users/${props.username}/allblogs`);
        } else {
          console.error("Failed to delete blog");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  }

  return (
    <div className="blog">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <Link to={`/updateBlog/${props.id}`}>
        <button onClick={props.onClick}>Update</button>
      </Link>
      <button onClick={handleDelete}>DELETE</button>
      
      
    </div>
  );
}

export default Blog;

