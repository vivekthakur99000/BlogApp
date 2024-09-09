import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import Blog from "../models/Blog.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { title, content } = req.body;
  try {
    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all blog post

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a single blog post

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {}
});

// update the blog author only

router.put("/:id", protect, async (req, res) => {
  const { title, content } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      if (blog.author.toString() !== req.user._id.toString()) {
        return res
          .status(401)
          .json({ message: "Not authorzied to update this blog" });
      }
      blog.title = title || blog.title;
      blog.content = content || blog.content;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete the blog

router.delete('/:id', protect, async (req, res) => {
    try {

        const blog = Blog.findById(req.params.id);

        if(blog){
            if(blog.author.toString() !== req.user._id.toString()){
                return res.status(401).json({message : "Not authorized to delete this post"});
            }
            await blog.remove();
            res.json({message : "Blog removed"});
        }else{
            res.status(404).json({message :'blog not found'});
        }
        
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

export default router;