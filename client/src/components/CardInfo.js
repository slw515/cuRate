import React, { useContext } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";
import { UserContext } from "../contextComponents/auth";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

function CardInfo({
  post: { title, body, createdAt, id, username, comments, likes, gallery }
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
    <Card className="cardInfoHome">
      {/* {user && user.username === username ? (
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
      )} */}
      <Card.Header variant="top">
        <div class="imageContainer">
          <img src={gallery[0].image} />
        </div>
        <div class="imageContainer">
          <img src={gallery[1].image} />
        </div>{" "}
        <div class="imageContainer">
          <img src={gallery[2].image} />
        </div>
        <div class="imageContainer">
          <img src={gallery[3].image} />
        </div>{" "}
      </Card.Header>

      <Card.Body>
        <a as={Link} to={`/posts/${id}`}>
          <Card.Title as={Link} to={`/posts/${id}`}>
            {title}
          </Card.Title>
        </a>
        <a as={Link} to={`/posts/${id}`}>
          <Card.Text>By: {username}</Card.Text>
        </a>
        <div className="cardsHomeButtonsWrapper">
          <Button as="div" color="red" labelPosition="right" onClick={likePost}>
            <Button
              color="red"
              className={`${isLiked() ? "" : "basic"}`}
              as={Link}
              to={`${user ? `/` : `/login`}`}
            >
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
            to={`${user ? `/posts/${id}` : `/login`}`}
          >
            <Button color="blue" basic>
              <Icon name="comment" />
            </Button>
            <Label as="a" basic color="blue" pointing="left">
              {comments.length}
            </Label>
          </Button>
          {/* {user && user.username === username ? (
            <Button color="red" onClick={deletePostFunc}>
              {" "}
              Delete Post
            </Button>
          ) : (
            <></>
          )} */}
        </div>
        <Card.Footer>
          <small className="text-muted">{createdAt.split("T")[0]}</small>
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
