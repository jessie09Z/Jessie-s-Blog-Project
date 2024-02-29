import React from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Blog(props) {
  const navigate = useNavigate();
  const { id, username,onDelete,  title, content} = props;


    async function handleDelete() {
      let isConfirmed = false;
    
      const confirmDelete = async () => {
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
      };
    
      const handleClose = () => {
        if (isConfirmed) {
          confirmDelete();
         
        }
      };
    

    
      toast.warning( <div>
        <p>Are you sure you want to delete this blog?</p>
        <button onClick={() => { 
          isConfirmed = true; 
          
          handleClose();
          
        }}>
          Confirm
        </button>
      </div>, {
        autoClose: 5000,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        onClose: handleClose,
        
      });
    }
  function handleUpdate() {
    const updateUrl = `/users/${username}/updateBlog/${id}`;
    navigate(updateUrl, { state: { title, content } });
  }

  return (
    <div className="blog">
  <h1>{props.title}</h1>
  <p>{props.content}</p>
  <div className="button-container">
    <Link to={`/users/${username}/updateBlog/${id}`} state={{ title, content }}>
      <button onClick={handleUpdate}>Update</button>
    </Link>
    <div>
      <button onClick={handleDelete}>Delete</button>
     
    </div>
    
  </div>
  <ToastContainer />
</div>
  );
}

export default Blog;

