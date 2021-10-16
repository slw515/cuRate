const Post = require("../../models/Post");
const checkAuth = require("../../util/check_auth");
const { AuthenticationError } = require("apollo-server");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: 1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post does not exist!");
        }
      } catch (err) {
        throw new Error("wjat tje fuck");
      }
    }
  },
  Mutation: {
    async createPost(_, { body, title, gallery }, context) {
      const user = checkAuth(context);
      console.log(gallery);
      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        title: title,
        body: body,
        gallery: gallery,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (user.username == post.username) {
          var postCopy = post;
          await post.delete();
          return postCopy.id;
        } else {
          throw new AuthenticationError("Action Not Allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find(like => like.username === username)) {
          post.likes = post.likes.filter(like => like.username !== username);
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }
        await post.save();
        return post;
      } else {
        throw new AuthenticationError("Action Not Allowed");
      }
    }
  }
};
