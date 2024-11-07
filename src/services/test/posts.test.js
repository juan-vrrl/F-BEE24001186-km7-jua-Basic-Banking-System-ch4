import PostService from "../posts"; // Adjust the import path as necessary
import prismaMock from "../../utils/singleton"; // Mocked Prisma client
import AppError from "../../utils/AppError"; // Custom error class
import imagekit from "../../utils/imageKit"; // Mocked ImageKit service

describe("PostService", () => {
  let postService;

  beforeEach(() => {
    postService = new PostService();
    jest.spyOn(console, "error").mockImplementation(() => {});

    imagekit.upload = jest.fn();
    imagekit.deleteFile = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createPost", () => {
    it("should create a post with the provided data", async () => {
      const userId = 1;
      const file = { buffer: Buffer.from("file content") };
      const title = "Test Post";
      const description = "This is a test post.";

      const uploadResult = { url: "newUrl", fileId: "newFileId" };
      imagekit.upload.mockResolvedValue(uploadResult);

      const newPost = {
        id: 1,
        title,
        description,
        contentUrl: uploadResult.url,
        fileId: uploadResult.fileId,
      };
      prismaMock.post.create.mockResolvedValue(newPost);

      const result = await postService.createPost(
        userId,
        file,
        title,
        description
      );

      expect(result).toEqual(newPost);
      expect(imagekit.upload).toHaveBeenCalledWith({
        file: file.buffer,
        fileName: expect.stringMatching(`post_${userId}_\\d+`), 
        folder: "/post_content/",
      });
      expect(prismaMock.post.create).toHaveBeenCalledWith({
        data: {
          title,
          description,
          contentUrl: uploadResult.url,
          fileId: uploadResult.fileId,
          author: { connect: { id: userId } },
        },
      });
    });

    it("should throw an error if the image upload fails", async () => {
      const userId = 1;
      const file = { buffer: Buffer.from("file content") };
      const title = "Test Post";
      const description = "This is a test post.";

      imagekit.upload.mockRejectedValue(new Error("Upload error"));

      await expect(
        postService.createPost(userId, file, title, description)
      ).rejects.toThrow(Error);
      expect(console.error).toHaveBeenCalledWith(
        "Error creating post:",
        expect.any(Error)
      );
    });
  });

  describe("getAllPosts", () => {
    it("should fetch all posts", async () => {
      const posts = [
        { id: 1, title: "Post 1", description: "Description 1" },
        { id: 2, title: "Post 2", description: "Description 2" },
      ];

      prismaMock.post.findMany.mockResolvedValue(posts);

      const result = await postService.getAllPosts();

      expect(result).toEqual(posts);
      expect(prismaMock.post.findMany).toHaveBeenCalled();
    });

    it("should handle errors when fetching posts", async () => {
      prismaMock.post.findMany.mockRejectedValue(new Error("Fetch error"));

      await expect(postService.getAllPosts()).rejects.toThrow(Error);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching posts:",
        expect.any(Error)
      );
    });
  });

  describe("getPostById", () => {
    it("should fetch a post by ID", async () => {
      const post = { id: 1, title: "Post 1", description: "Description 1" };

      prismaMock.post.findUnique.mockResolvedValue(post);

      const result = await postService.getPostById(1);

      expect(result).toEqual(post);
      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw an error if the post is not found", async () => {
      prismaMock.post.findUnique.mockResolvedValue(null);

      await expect(postService.getPostById(1)).rejects.toThrow(AppError);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching post:",
        expect.any(Error)
      );
    });
  });

  describe("updatePost", () => {
    it("should update a post by ID", async () => {
      const payload = {
        title: "Updated Title",
        description: "Updated Description",
      };
      const existingPost = {
        id: 1,
        title: "Old Title",
        description: "Old Description",
      };
      const updatedPost = {
        id: 1,
        title: "Updated Title",
        description: "Updated Description",
      };

      prismaMock.post.findUnique.mockResolvedValue(existingPost);
      prismaMock.post.update.mockResolvedValue(updatedPost);

      const result = await postService.updatePost(1, payload);

      expect(result).toEqual(updatedPost);
      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: payload,
      });
    });

    it("should throw an error if the post is not found", async () => {
      prismaMock.post.findUnique.mockResolvedValue(null);
      const payload = {
        title: "Updated Title",
        description: "Updated Description",
      };

      await expect(postService.updatePost(1, payload)).rejects.toThrow(
        AppError
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error updating post:",
        expect.any(Error)
      );
    });
  });

  describe("deletePost", () => {
    it("should delete a post by ID", async () => {
      const post = { id: 1, title: "Post 1", fileId: "fileId1" };

      prismaMock.post.findUnique.mockResolvedValue(post);
      prismaMock.post.delete.mockResolvedValue(post);

      const result = await postService.deletePost(1);

      expect(result).toEqual({
        message: `Post with ID 1 and associated file deleted successfully`,
      });
      expect(imagekit.deleteFile).toHaveBeenCalledWith(post.fileId);
      expect(prismaMock.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw an error if the post is not found", async () => {
      prismaMock.post.findUnique.mockResolvedValue(null);

      await expect(postService.deletePost(1)).rejects.toThrow(AppError);
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting post:",
        expect.any(Error)
      );
    });

    it("should handle errors when deleting a post", async () => {
      const post = { id: 1, title: "Post 1", fileId: "fileId1" };

      prismaMock.post.findUnique.mockResolvedValue(post);
      prismaMock.post.delete.mockRejectedValue(new Error("Delete error"));

      await expect(postService.deletePost(1)).rejects.toThrow(Error);
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting post:",
        expect.any(Error)
      );
    });
  });
});
