const { ApolloServer } = require("apollo-server");
const graphql = require("graphql-tag");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers/index");
const { MONGODB } = require("./config");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("db success");
    return server.listen({ port: 5000 });
  })
  .then(res => {
    console.log("server started: " + res.url);
  });
