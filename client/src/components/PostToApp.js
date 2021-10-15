import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import gql from "graphql-tag";
import { UserContext } from "../contextComponents/auth";
import { useMutation } from "@apollo/react-hooks";

function PostToApp() {
  const { user } = useContext(UserContext);
  const [postContent, setPostContent] = useState({
    username: user.username,
    body: "",
    id: null,
    createdAt: null
  });

  const inputChange = event => {
    setPostContent({ ...postContent, [event.target.name]: event.target.value });
  };

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: postContent,
    update(_, result) {
      console.log(result);
      postContent.body = "";
    }
  });

  const submitRegisterForm = event => {
    event.preventDefault();
    createPost();
  };

  return (
    <>
      <Form noValidate onSubmit={submitRegisterForm}>
        <h1>Create A Post</h1>
        <h5>{postContent.username}</h5>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Post:</Form.Label>
          <Form.Control
            type="input"
            placeholder="Your Post Here!"
            name="body"
            value={postContent.body}
            onChange={inputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Post
        </Button>
      </Form>
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      body
      id
      username
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
    }
  }
`;
export default PostToApp;
