import React, { useContext } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";
import { UserContext } from "../contextComponents/auth";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

function CardInfo({
  post: { body, createdAt, id, username, comments, likes }
}) {
  const postId = id;
  const { user } = useContext(UserContext);

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
    },
    onError(err) {
      return err;
    }
  });

  const [likePost, { erro }] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: RETRIEVE_POSTS_QUERY
      });
      proxy.writeQuery({
        query: RETRIEVE_POSTS_QUERY,
        data: {
          getPosts: data.getPosts
        }
      });
    },
    onError(err) {
      return err;
    }
  });

  var isLiked = () => {
    if (!user) {
      return false;
    }
    var liked = false;
    for (var i = 0; i < likes.length; i++) {
      if (likes[i].username == user.username) {
        liked = true;
        return liked;
      }
    }
    return liked;
  };

  const deletePostFunc = () => {
    deletePost();
  };
  const likePostFunc = () => {
    likePost();
  };

  function comment() {
    console.log("commented!");
  }
  return (
    <Card>
      {user && user.username === username ? (
        <Button
          className="editButtonOwnPost"
          color="teal"
          icon
          as={Link}
          to={`/posts/${id}`}
        >
          <Icon name="edit" />
        </Button>
      ) : (
        <></>
      )}
      <Card.Img variant="top" src="holder.js/100px160" />
      <Card.Body>
        <a as={Link} to={`/posts/${id}`}>
          <Card.Title as={Link} to={`/posts/${id}`}>
            {username}
          </Card.Title>
        </a>
        <a as={Link} to={`/posts/${id}`}>
          <Card.Text>{body}</Card.Text>
        </a>
        <Button as="div" color="red" labelPosition="right" onClick={likePost}>
          <Button color="red" className={`${isLiked() ? "" : "basic"}`}>
            <Icon name="heart" />
          </Button>
          <Label as="a" basic color="red" pointing="left">
            {likes.length}
          </Label>
        </Button>
        <Button
          as="div"
          labelPosition="right"
          onClick={comment}
          as={Link}
          to={`/posts/${id}`}
        >
          <Button color="blue" basic onClick={deletePostFunc}>
            <Icon name="comment" />
          </Button>
          <Label as="a" basic color="blue" pointing="left">
            {comments.length}
          </Label>
        </Button>
        {user && user.username === username ? (
          <Button color="red" onClick={deletePostFunc}>
            {" "}
            Delete Post
          </Button>
        ) : (
          <></>
        )}
        <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
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

export default CardInfo;
