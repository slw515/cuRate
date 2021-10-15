import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Container, Card, Row } from "react-bootstrap";
import CardInfo from "../components/CardInfo";
import PostToApp from "../components/PostToApp";

import { UserContext } from "../contextComponents/auth";

function Home() {
  const { user } = useContext(UserContext);
  const { loading, data } = useQuery(RETRIEVE_POSTS_QUERY);
  console.log(data);
  return (
    <Container>
      {user && <PostToApp></PostToApp>}
      <Row>
        <h1>Home</h1>
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
