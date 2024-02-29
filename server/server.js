import express from "express";
import cors from "cors";
import pg from "pg";
import { config as dotenvConfig } from 'dotenv';



const app = express();
const port = 5000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenvConfig({ path: '.env' });
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();
app.get("/", (req, res) => {
  res.send("Welcome to the Blog API"); // You can send any message you want here
});
//api endpoint for login. Compare user info with db. 
app.get("/api/login", (req, res) => {
  res.status(405).send("GET method not allowed for /api/login");
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Received login request:", username, password);
  try {
    const result = await db.query("select * from users where username =$1 and password=$2", [username, password]);
    console.log("DB Query Result:", result.rows);
    if (result.rows.length > 0) {
      const loggedInUser = result.rows[0].username;
      res.json({ success: true, message: "Login successful", username: loggedInUser });

    }
    else {
      res.json({ success: false, message: "Invalid username or password " });
    }
  }
  catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
})
//api endpoint for register new users. 
app.get("/api/register", (req, res) => {
  res.status(405).send("GET method not allowed for /api/register");
});
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  console.log("Received register request:", username, password);
  //check if username already exist. 
  try {
    const result = await db.query("select * from users where username =$1 and password=$2", [username, password]);
    console.log("DB Query Result:", result.rows);
    if (result.rows.length > 0) {
      res.json({ success: false, message: "Username already exist, please register with different username" });

    }
    else {
      const result = await db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", [username, password]);
      console.log("New user inserted:", result.rows[0]);

      res.json({ success: true, message: "User registered successfully" });
    }
  }
  catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
})

app.get("/api/user/:username/blogs", async (req, res) => {
  const { username } = req.params;
  console.log("Fetching blogs for user:", username);
  try {
    const query = `
        SELECT blogs.*, users.username
        FROM blogs
        INNER JOIN users
        ON blogs.userid = users.id
        WHERE users.username = $1
      `;
    const result = await db.query(query, [username]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user blogs", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// post new blog to db

app.post("/api/user/:username/new", async (req, res) => {
  const { title, content } = req.body;
  const { username } = req.params;
  try {
    const query = `INSERT INTO blogs (title, content, userid)
      VALUES ($1, $2, (SELECT id FROM users WHERE username = $3)) returning *;`
    const newBlog = await db.query(query, [title, content, username]);
    console.log(newBlog);
    const insertedBlog = newBlog.rows[0];
    console.log("Inserted blog:", insertedBlog);

    res.status(200).json({ success: true, message: "Blog inserted successfully", blog: insertedBlog });


  } catch (error) {
    console.error("Error inserting new blogs", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
})

app.delete("/api/user/:username/blogs/:id", async (req, res) => {
  const { username, id } = req.params;

  try {

    const query = `
      DELETE FROM blogs
      USING users
      WHERE
        blogs.userid = users.id
        AND users.username = $1
        AND blogs.blogid = $2
    `;
    await db.query(query, [username, id]);

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.patch("/api/user/:username/blogs/:id", async (req, res) => {
  const { title, content } = req.body;
  const { username, id } = req.params;

  try {
    const query = `
            UPDATE blogs
            SET title = $1, content = $2
            WHERE
            userid = (SELECT id FROM users WHERE username = $3)
            AND blogid = $4
            RETURNING *;
        `;

    const updatedBlog = await db.query(query, [title, content, username, id]);

    if (updatedBlog.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, data: updatedBlog.rows[0] });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});