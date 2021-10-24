const { ApolloServer, PubSub } = require("apollo-server");
const graphql = require("graphql-tag");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers/index");
const { MONGODB } = require("./config.js");

const PORT = process.env.PORT || 5000;
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("db success");
    return server.listen({ port: PORT });
  })
  .then(res => {
    console.log("server started: " + res.url);
  })
  .catch(err => {
    console.log(err);
  });
