import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as templating engine
app.set("view engine", "ejs");

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render("index", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to render the new post page
app.get("/new", (req, res) => {
  res.render("modify", { heading: "New Post", submit: "Create Post", post: {} });
  
});

// Route to render the edit post page
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render("modify", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Route to create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Route to update an existing post
app.post("/api/posts/:id", async (req, res) => {
  try {
    const response = await axios.patch(`${API_URL}/posts/${req.params.id}`, req.body);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Route to delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
/////////////
////
///
//
//
///
///
///
///
//
///
//////
/////
/////
