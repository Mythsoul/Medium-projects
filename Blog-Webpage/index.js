import express from "express";
import bodyParser from "body-parser";
import pg from "pg"; 
const app = express();
const port = 4000;

// Database connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost", 
  database: "blogwebpage", 
  password: "123456", 
  port: 5432
});

db.connect(err => {
  if (err) {
    console.error("Unable to connect to the database:", err.message);
  } else {
    console.log("Database connected");
  }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET all posts
app.get("/posts", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific post by id
app.get("/posts/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [parseInt(req.params.id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new post
app.post("/posts", async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *",
      [title, content, author]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH a post
app.patch("/posts/:id", async (req, res) => {
  const { title, content, author } = req.body;
  const fields = [];
  const values = [];
  let index = 1;

  if (title) {
    fields.push(`title = $${index}`);
    values.push(title);
    index++;
  }
  if (content) {
    fields.push(`content = $${index}`);
    values.push(content);
    index++;
  }
  if (author) {
    fields.push(`author = $${index}`);
    values.push(author);
    index++;
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  values.push(parseInt(req.params.id));
  const query = `UPDATE posts SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;

  try {
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a specific post
app.delete("/posts/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM posts WHERE id = $1 RETURNING *", [parseInt(req.params.id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
