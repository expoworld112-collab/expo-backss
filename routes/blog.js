import express from "express";
<<<<<<< HEAD
import mongoose from "mongoose";
import slugify from "slugify";
import Blog from "../models/blog.js";
import { requireSignin, authMiddleware, adminMiddleware, canUpdateDeleteBlog } from "./auth.js";

const router = express.Router();

// --- Connect to MongoDB
const connectDB = async () => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

// ==================== Create Blog ====================
router.post("/blog", requireSignin, authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const { title, body, categories, tags } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required" });
    }

    const slug = slugify(title).toLowerCase();

    const blog = new Blog({
      title,
      body,
      slug,
      categories,
      tags,
      postedBy: req.profile._id,
    });

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error("Create blog error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==================== Get all blogs ====================
router.get("/blogs", async (req, res) => {
  try {
    await connectDB();
    const blogs = await Blog.find()
      .populate("postedBy", "_id name username")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Get blogs error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==================== Get single blog by slug ====================
router.get("/blog/:slug", async (req, res) => {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("postedBy", "_id name username");

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json(blog);
  } catch (err) {
    console.error("Get blog error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==================== Update Blog ====================
router.put(
  "/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateDeleteBlog,
  async (req, res) => {
    try {
      await connectDB();
      const { title, body, categories, tags } = req.body;

      const blog = await Blog.findOne({ slug: req.params.slug });
      if (!blog) return res.status(404).json({ error: "Blog not found" });

      blog.title = title || blog.title;
      blog.body = body || blog.body;
      blog.slug = title ? slugify(title).toLowerCase() : blog.slug;
      blog.categories = categories || blog.categories;
      blog.tags = tags || blog.tags;

      await blog.save();
      res.json(blog);
    } catch (err) {
      console.error("Update blog error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ==================== Delete Blog ====================
router.delete(
  "/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateDeleteBlog,
  async (req, res) => {
    try {
      await connectDB();
      const blog = await Blog.findOneAndDelete({ slug: req.params.slug });
      if (!blog) return res.status(404).json({ error: "Blog not found" });

      res.json({ message: "Blog deleted successfully" });
    } catch (err) {
      console.error("Delete blog error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
=======
const router = express.Router();
import { create, list, list2, listAllBlogsCategoriesTags, read, remove, update, relatedposts, listSearch, listByUser, allblogs, feeds, allblogslugs } from "../controllers/blog.js"
import { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } from "../controllers/auth.js"

router.post('/blog', requireSignin, adminMiddleware, create);
router.get('/blogs', list);
router.get('/allblogs', allblogs);
router.get('/rss', feeds);
router.get('/blogs/search', listSearch);
router.get('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug', read);
router.delete('/blog/:slug', requireSignin, adminMiddleware, remove);
router.patch('/blog/:slug', requireSignin, adminMiddleware, update);
router.get('/blog/related/:slug', relatedposts);
router.get('/allblogslugs', allblogslugs);

router.get('/:username/userblogs', list2);
router.post('/user/blog', requireSignin, authMiddleware, create);
router.get('/:username/blogs', listByUser);
router.delete('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, remove);
router.patch('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);

export default router

>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b
