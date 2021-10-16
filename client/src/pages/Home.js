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
      <Tabs
        defaultActiveKey="galleries"
        id="tabs-for-main-app"
        className="tabs-for-main-app mb-3 nav-fill"
      >
        <Tab eventKey="home" title="Create Gallery">
          {user ? (
            <PostToApp></PostToApp>
          ) : (
            <Container>
              <Row>
                <h1 style={{ marginTop: "12rem", textAlign: "center" }}>
                  Please Login or Register!
                </h1>
              </Row>
            </Container>
          )}
        </Tab>
        <Tab eventKey="galleries" title="Galleries">
          <Container>
            <Row>
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
            </Row>
          </Container>
        </Tab>
        <Tab eventKey="myGalleries" title="My Galleries">
          <Container>
            <Row>
              {loading ? (
                <h1>Loading Posts...</h1>
              ) : data.getPosts && user != null ? (
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
              ) : (
                <h1 style={{ marginTop: "12rem", textAlign: "center" }}>
                  Please Login or Register!
                </h1>
              )}{" "}
            </Row>
          </Container>
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
      title
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
      gallery {
        artist
        id
        image
        title
        userDescription
      }
    }
  }
`;

export default Home;
