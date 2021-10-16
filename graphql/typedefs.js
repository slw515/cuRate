const graphql = require("graphql-tag");

module.exports = graphql`
  type Post {
    id: ID!
    body: String!
    title: String!
    gallery: [ArtWorkOfGallery]!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
  }
  type Comment {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!, title: String!, gallery: [ArtWork!]!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
  input ArtWork {
    artist: String!
    id: String!
    image: String!
    title: String!
    userDescription: String!
  }
  type ArtWorkOfGallery {
    artist: String!
    id: String!
    image: String!
    title: String!
    userDescription: String!
  }
`;
