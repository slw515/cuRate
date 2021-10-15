import React from "react";
import App from "./App";
import { setContext } from "apollo-link-context";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider
} from "@apollo/client";
//assign authorization headers: https://www.npmjs.com/package/apollo-link-context
const setAuthorizationLink = setContext(() => {
  const token = localStorage.getItem("loggedInToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost:5000"
});

function generateTokenAndLink(token, link) {
  return token.concat(link);
}

const client = new ApolloClient({
  link: generateTokenAndLink(setAuthorizationLink, httpLink),
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
