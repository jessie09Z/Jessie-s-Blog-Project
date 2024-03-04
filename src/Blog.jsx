import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Blog(props) {
  const navigate = useNavigate();
  const { id, username, onDelete, title, content } = props;

  async function handleDelete() {
    // 使用 toast 替换 window.confirm
    toast.warning(
      <div>
        <p>Are you sure you want to delete this blog?</p>
        <button className="logout-btn" onClick={confirmDelete}>
          Confirm
        </button>
      </div>,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      }
    );

    function confirmDelete() {
      deleteBlog();
      toast.dismiss();
    }

    async function deleteBlog() {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/user/${username}/blogs/${id}`
        );
        console.log(`http://localhost:5000/api/user/${username}/blogs/${id}`);
        console.log(response, "delete response");
        if (response.status === 200) {
          console.log("delete success, wait for go back to allblogs");
          onDelete(id);
          navigate(`/users/${username}/allblogs`);
        } else {
          console.error("Failed to delete blog");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  }

  function handleUpdate() {
    const updateUrl = `/users/${username}/updateBlog/${id}`;
    navigate(updateUrl, { state: { title, content } });
  }

  return (
    <div className="blog">
      <h1>{title}</h1>
      <p>{content}</p>
      <div className="button-container">
        <Link to={`/users/${username}/updateBlog/${id}`} state={{ title, content }}>
          <button onClick={handleUpdate}>Update</button>
        </Link>
        <div>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Blog;