import prisma from "../utils/prisma.js";
import AppError from "../utils/AppError.js";
import imagekit from "../utils/imageKit.js";

class PostService {
  constructor() {
    this.prisma = prisma;
  }

  async createPost(userId, file, title, description) {
    try {
      const result = await imagekit.upload({
        file: file.buffer,
        fileName: `post_${userId}_${Date.now()}`,
        folder: "/post_content/",
      });

      if (!result) {
        throw new AppError("Error uploading post content", 500);
      }

      const newPost = await this.prisma.post.create({
        data: {
          title,
          description,
          contentUrl: result.url,
          fileId: result.fileId,
          author: { connect: { id: userId } },
        },
      });

      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  // Fetch all post
  async getAllPosts() {
    try {
      const posts = await this.prisma.post.findMany();
      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  // Fetch a single post by ID
  async getPostById(id) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: parseInt(id) },
      });

      if (!post) {
        throw new AppError("Post not found", 404);
      }

      return post;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  }

  // Update a post by ID
  async updatePost(id, payload) {
    try {
      const { title, description } = payload;

      const post = await this.prisma.post.findUnique({
        where: { id: parseInt(id) },
      });

      if (!post) {
        throw new AppError("Post not found", 404);
      }

      const updatedPost = await this.prisma.post.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
        },
      });

      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }

  // Delete a post by ID
  async deletePost(id) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: parseInt(id) },
      });

      if (!post) {
        throw new AppError("Post not found", 404);
      }

      await imagekit.deleteFile(post.fileId);

      await this.prisma.post.delete({
        where: { id: parseInt(id) },
      });

      return {
        message: `Post with ID ${id} and associated file deleted successfully`,
      };
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }
}

export default PostService;
