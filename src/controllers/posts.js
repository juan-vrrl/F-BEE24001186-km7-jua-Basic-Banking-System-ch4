import PostService from "../services/posts.js";

const postService = new PostService();

// Create a new post
export const createPost = async (req, res, next) => {
  try {
    const { userId, title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    const newPost = await postService.createPost(
      parseInt(userId),
      req.file,
      title,
      description
    );
    res.status(201).json({
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// Get a single post by ID
export const getPostById = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await postService.getPostById(postId);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// Update a post by ID
export const updatePost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const payload = req.body;

    const updatedPost = await postService.updatePost(id, payload);
    res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a post by ID
export const deletePost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const result = await postService.deletePost(postId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
