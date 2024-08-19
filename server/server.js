import { config as dotenvConfig } from 'dotenv';
import express from "express";
import cors from "cors";
import pg from "pg";
import { fileURLToPath } from 'url';
import path from 'path';

dotenvConfig();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseURL="https://jessieblogs-h5cqa6h3hmgpfhf8.australiaeast-01.azurewebsites.net/";

dotenvConfig({ path: path.resolve(__dirname, "../.env") });
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://jessieblogs-h5cqa6h3hmgpfhf8.australiaeast-01.azurewebsites.net/',
      'http://localhost:3000'
    ];
    
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
//console.log("DB_URL:", process.env.DATABASE_URL);

const db = new pg.Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', 
  password: process.env.DB_PASSWORD || 'Jessie0901',
  port: process.env.DB_PORT || 5432,
});

const initializeDatabase = async () => {
  try {
    await db.connect();

    // Create users table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    // Create blogs table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        blogid SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log("Database tables ensured.");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1); // Exit the process with an error code
  }
};

initializeDatabase().then(() => {
  app.get(`/`, (req, res) => {
    res.send("Welcome to the Blog API");
  });

  app.get(`/api/login`, (req, res) => {
    res.status(405).send("GET method not allowed for /api/login");
  });

  app.post(`/api/login`, async (req, res) => {
    const { username, password } = req.body;
    console.log("Received login request:", username, password);
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password]);
      console.log("DB Query Result:", result.rows);
      if (result.rows.length > 0) {
        const loggedInUser = result.rows[0].username;
        res.json({ success: true, message: "Login successful", username: loggedInUser });
      } else {
        res.json({ success: false, message: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Error executing query", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.get(`/api/register`, (req, res) => {
    res.status(405).send("GET method not allowed for /api/register");
  });

  app.post(`/api/register`, async (req, res) => {
    const { username, password } = req.body;
    console.log("Received register request:", username, password);
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
      if (result.rows.length > 0) {
        res.json({ success: false, message: "Username already exists, please register with a different username" });
      } else {
        const result = await db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", [username, password]);
        console.log("New user inserted:", result.rows[0]);
        res.json({ success: true, message: "User registered successfully" });
      }
    } catch (error) {
      console.error("Error executing query", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.get(`/api/user/:username/blogs`, async (req, res) => {
    const { username } = req.params;
    console.log("Fetching blogs for user:", username);
    try {
      const query = `
        SELECT blogs.*, users.username
        FROM blogs
        INNER JOIN users ON blogs.userid = users.id
        WHERE users.username = $1
      `;
      const result = await db.query(query, [username]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching user blogs", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post(`/api/user/:username/new`, async (req, res) => {
    const { title, content } = req.body;
    const { username } = req.params;
    try {
      const query = `INSERT INTO blogs (title, content, userid) VALUES ($1, $2, (SELECT id FROM users WHERE username = $3)) RETURNING *;`
      const newBlog = await db.query(query, [title, content, username]);
      console.log(newBlog);
      const insertedBlog = newBlog.rows[0];
      console.log("Inserted blog:", insertedBlog);
      res.status(200).json({ success: true, message: "Blog inserted successfully", blog: insertedBlog });
    } catch (error) {
      console.error("Error inserting new blog", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.delete(`/api/user/:username/blogs/:id`, async (req, res) => {
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

  app.patch(`/api/user/:username/blogs/:id`, async (req, res) => {
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


// Serve static files from the "build" directory
app.use(express.static(path.join(__dirname, '../build')));

  console.log(`Index file path: ${path.resolve(__dirname, '../build', 'index.html')}`
);

// Handle all other routes by serving the index.html file
app.get('*', (req, res) => {
  console.log(`Request received for test app: ${req.originalUrl}`);
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});


  app.listen(port, () => {
    console.log(`Server is running on :${port}`);
  });
});