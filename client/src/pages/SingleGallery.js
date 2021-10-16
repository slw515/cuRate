import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { Button, Icon, Label } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";

import { useQuery } from "@apollo/react-hooks";
import { UserContext } from "../contextComponents/auth";

function SingleGallery(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(UserContext);
  console.log(postId);
  let postMarkup;
  const [comment, setComment] = useState("");

  const [likePost, { erro }] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId },
    onError(err) {
      return err;
    }
  });

  const [submitComment] = useMutation(POST_COMMENT_MUTATION, {
    update() {
      setComment("");
    },
    variables: {
      postId,
      body: comment
    }
  });

  const submitCommentFunc = event => {
    event.preventDefault();
    submitComment();
  };

  var isLiked = () => {
    if (!user) {
      return false;
    }
    var liked = false;
    for (var i = 0; i < data.getPost.likes.length; i++) {
      if (data.getPost.likes[i].username == user.username) {
        liked = true;
        return liked;
      }
    }
    return liked;
  };

  const { data } = useQuery(RETRIEVE_POST_QUERY, {
    variables: {
      postId
    },
    onCompleted() {
      console.log(data.getPost);
    }
  });

  if (!data) {
    postMarkup = <p>Loading post..</p>;
  } else {
    const {
      id,
      body,
      title,
      createdAt,
      username,
      comments,
      likes,
      gallery
    } = data.getPost;
    postMarkup = (
      <Container className="singlePagePost">
        {" "}
        <Row style={{ marginBottom: "50px" }}>
          <Card>
            <Card.Body>
              <h1>{title}</h1>
              <Card.Text>{body}</Card.Text>
            </Card.Body>
            <div style={{ marginBottom: "12px" }}>
              <Button
                as="div"
                color="red"
                labelPosition="right"
                onClick={likePost}
                style={{ float: "right" }}
              >
                <Button color="red" className={`${isLiked() ? "" : "basic"}`}>
                  <Icon name="heart" />
                </Button>
                <Label as="a" basic color="red" pointing="left">
                  {likes.length}
                </Label>
              </Button>
              <Button as="div" labelPosition="right" style={{ float: "right" }}>
                <Button color="blue" basic>
                  <Icon name="comment" />
                </Button>
                <Label as="a" basic color="blue" pointing="left">
                  {comments.length}
                </Label>
              </Button>
            </div>
          </Card>
        </Row>
        <Row>
          <h1>Artworks</h1>
          {gallery.map(item => (
            <div className="col-md-4">
              <Card className="artworkCard">
                <Card.Img variant="top" src={item.image} />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.userDescription}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
        <Row style={{ marginTop: "50px" }}>
          <h1>Comments:</h1>
          <Form onSubmit={submitCommentFunc}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Submit Comment:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={e => {
                  setComment(e.target.value);
                }}
              />
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form.Group>
          </Form>
          {comments.map(item => (
            <div className="col-md-12" style={{ margin: "20px 20px" }}>
              <Card className="artworkCard">
                <Card.Body>
                  <Card.Title>{item.username}</Card.Title>
                  <Card.Text>{item.body}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
      </Container>
    );
  }
  return postMarkup;
}

const RETRIEVE_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      title
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

const POST_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
    }
  }
`;

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
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
export default SingleGallery;
