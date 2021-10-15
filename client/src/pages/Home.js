import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Container, Card, Row, Tab, Tabs } from "react-bootstrap";
import CardInfo from "../components/CardInfo";
import PostToApp from "../components/PostToApp";

import { UserContext } from "../contextComponents/auth";

function Home() {
  const { user } = useContext(UserContext);
  const { loading, data } = useQuery(RETRIEVE_POSTS_QUERY);

  return (
    <Container>
      <Row>
        <h1>Home</h1>
      </Row>
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Create Gallery">
          {user && <PostToApp></PostToApp>}
        </Tab>
        <Tab eventKey="galleries" title="Galleries">
          {loading ? (
            <h1>Loading Posts...</h1>
          ) : (
            data.getPosts &&
            data.getPosts.map(post => (
              <div className="col-md-4" key={post.id}>
                <CardInfo post={post}></CardInfo>
              </div>
            ))
          )}
        </Tab>
        <Tab eventKey="myGalleries" title="My Galleries">
          {loading ? (
            <h1>Loading Posts...</h1>
          ) : (
            data.getPosts &&
            data.getPosts.map(function(post, i) {
              console.log(post.username);
              return post.username == user.username ? (
                <div className="col-md-4" key={post.id}>
                  <CardInfo post={post}></CardInfo>
                </div>
              ) : (
                <></>
              );
            })
          )}
        </Tab>
      </Tabs>
    </Container>
  );
}

const RETRIEVE_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      username
      createdAt
      comments {
        body
        username
        createdAt
      }
      likes {
        username
        createdAt
      }
    }
  }
`;

export default Home;
