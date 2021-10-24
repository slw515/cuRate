import React, { useContext, useState, useEffect } from "react";
import gql from "graphql-tag";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { Button, Icon, Label, Confirm } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import loadingImage from "../images/loading.gif";
import { useQuery } from "@apollo/react-hooks";
import { UserContext } from "../contextComponents/auth";
import Comment from "../components/Comment";
function SingleGallery(props) {
  const postId = props.match.params.postId;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [commentId, setCommentId] = useState("");

  const { user } = useContext(UserContext);
  let postContent;
  const [comment, setComment] = useState("");

  const [likePost, { erro }] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: RETRIEVE_POSTS_QUERY
      });
    },
    onError(err) {
      return err;
    }
  });

  const [deletePost, { error }] = useMutation(DELETE_POST_MUTATION, {
    variables: { postId },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: RETRIEVE_POSTS_QUERY
      });
      proxy.writeQuery({
        query: RETRIEVE_POSTS_QUERY,
        data: {
          getPosts: data.getPosts.filter(
            post => post.id != result.data.deletePost
          )
        }
      });
      props.history.push("/");
    },

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
    if (user) {
      submitComment();
      document.getElementById("commentSubmissionTextArea").value = "";
    }
  };

  const [deleteCommentMutate, { errors }] = useMutation(
    DELETE_COMMENT_MUTATION,
    {
      update() {
        setCommentId("");
      },
      variables: { postId, commentId },

      onError(err) {
        return err;
      }
    }
  );

  useEffect(() => {
    deleteCommentMutate();
  }, [commentId]);

  const deleteCommentFunc = event => {
    setCommentId(event.target.id);
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
    postContent = (
      <div className="centerLoading">
        <img src={loadingImage} />
      </div>
    );
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
    postContent = (
      <Container className="singlePagePost">
        {" "}
        <Row style={{ marginBottom: "50px" }}>
          <Card>
            <Card.Body>
              <h1>{title}</h1>
              <Card.Text>Created by: {body}</Card.Text>
            </Card.Body>
            <div style={{ padding: "1rem 1rem" }}>
              {user != null && user.username == username ? (
                <>
                  <Button
                    color="red"
                    onClick={() => setConfirmDelete(true)}
                    style={{ float: "left" }}
                    // onConfirm={deletePost}
                  >
                    {" "}
                    Delete Post
                  </Button>
                  <Confirm
                    open={confirmDelete}
                    onCancel={() => setConfirmDelete(false)}
                    onConfirm={deletePost}
                  />
                </>
              ) : (
                <></>
              )}
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
                <Button as="a" href="#commentsSection" color="blue" basic>
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
            <div className="col-md-4" style={{ marginTop: "12px" }}>
              <Card className="artworkCard">
                <Card.Img variant="top" src={item.image} />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.userDescription}</Card.Text>
                  <small className="text-muted">{item.artist}</small>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
        <Row id="commentsSection" style={{ marginTop: "50px" }}>
          <h1>Comments:</h1>
          <Form onSubmit={submitCommentFunc}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Type your comment here..."
                id="commentSubmissionTextArea"
                onChange={e => {
                  setComment(e.target.value);
                }}
              />
              <Button
                className="submitComment"
                variant="primary"
                color="blue"
                type="submit"
              >
                {user != null ? "Submit" : "Please Log In To Submit Comments"}
              </Button>
            </Form.Group>
          </Form>
          <div
            className="col-md-12"
            style={{ margin: "20px 0px 10px 20px" }}
            id="commentsSection"
          >
            {comments.map(item => (
              <Comment
                item={item}
                postId={postId}
                commentId={item.id}
              ></Comment>
            ))}
          </div>
        </Row>
      </Container>
    );
  }
  return postContent;
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
        id
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

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const RETRIEVE_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      username
      createdAt
      comments {
        id
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
