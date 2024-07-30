const express = require("express");
const multer = require("multer");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");

// destination function for handling file uploads using the multer library

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// create a new post

router.post("/", auth, upload.single("image"), async (req, res) => {
  const { content } = req.body;

  try {
    const newPost = new Post({
      user: req.user._id,
      content,
      image: req.file ? req.file.path : "",
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Get all Posts

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", ["username", "profilePicture"])
      .sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Like a post

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params, id);

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.push(req.user._id);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Comment a post

router.put("/comment/:id", auth, async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    const comment = {
      user: req.user._id,
      text,
    };
    post.comments.push(newComment);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
