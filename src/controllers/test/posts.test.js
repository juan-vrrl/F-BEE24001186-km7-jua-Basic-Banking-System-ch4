import { createPost, getAllPosts, getPostById, updatePost, deletePost } from "../posts.js";
import PostService from "../../services/posts.js";

// Mock the PostService
jest.mock("../../services/posts.js");

describe("Post Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      file: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createPost", () => {
    test("should create a post and return 201 status", async () => {
      req.body = { userId: 1, title: "New Post", description: "Post description" };
      req.file = { buffer: Buffer.from("file content"), originalname: "test.jpg" };
      const newPost = { id: 1, ...req.body, file: req.file };

      PostService.prototype.createPost.mockResolvedValue(newPost);

      await createPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post created successfully",
        data: newPost,
      });
    });

    test("should return 400 if no file is provided", async () => {
      req.body = { userId: 1, title: "New Post", description: "Post description" };

      await createPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Please upload a file" });
    });

    test("should handle error when creating a post", async () => {
      const errorMessage = "Failed to create post";
      req.file = { buffer: Buffer.from("file content"), originalname: "test.jpg" };
      PostService.prototype.createPost.mockRejectedValue(new Error(errorMessage));

      await createPost(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("getAllPosts", () => {
    test("should return all posts with 200 status", async () => {
      const posts = [
        { id: 1, title: "Post 1", description: "Description 1" },
        { id: 2, title: "Post 2", description: "Description 2" },
      ];
      PostService.prototype.getAllPosts.mockResolvedValue(posts);

      await getAllPosts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(posts);
    });

    test("should handle error when retrieving all posts", async () => {
      const errorMessage = "Failed to get posts";
      PostService.prototype.getAllPosts.mockRejectedValue(new Error(errorMessage));

      await getAllPosts(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("getPostById", () => {
    test("should return a post by ID with 200 status", async () => {
      const post = { id: 1, title: "Post 1", description: "Description 1" };
      req.params.id = 1;
      PostService.prototype.getPostById.mockResolvedValue(post);

      await getPostById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(post);
    });

    test("should handle error when retrieving a post by ID", async () => {
      const errorMessage = "Post not found";
      req.params.id = 1;
      PostService.prototype.getPostById.mockRejectedValue(new Error(errorMessage));

      await getPostById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("updatePost", () => {
    test("should update a post and return 200 status", async () => {
      const payload = { title: "Updated Title", description: "Updated description" };
      const updatedPost = { id: 1, ...payload };
      req.params.id = 1;
      req.body = payload;
      PostService.prototype.updatePost.mockResolvedValue(updatedPost);

      await updatePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post updated successfully",
        data: updatedPost,
      });
    });

    test("should handle error when updating a post", async () => {
      const errorMessage = "Failed to update post";
      req.params.id = 1;
      req.body = { title: "Updated Title" };
      PostService.prototype.updatePost.mockRejectedValue(new Error(errorMessage));

      await updatePost(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });

  describe("deletePost", () => {
    test("should delete a post and return 200 status", async () => {
      const deletedPost = { id: 1, title: "Post 1", description: "Description 1" };
      req.params.id = 1;
      PostService.prototype.deletePost.mockResolvedValue(deletedPost);

      await deletePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedPost);
    });

    test("should handle error when deleting a post", async () => {
      const errorMessage = "Failed to delete post";
      req.params.id = 1;
      PostService.prototype.deletePost.mockRejectedValue(new Error(errorMessage));

      await deletePost(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });
  });
});
