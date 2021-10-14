import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";

function CardInfo({
  post: {
    body,
    createdAt,
    id,
    username,
    comments,
    likes,
    likeCount,
    commentCount
  }
}) {
  function likePost() {
    console.log("liked post");
  }

  function comment() {
    console.log("commented!");
  }
  return (
    <Card>
      <Card.Img variant="top" src="holder.js/100px160" />
      <Card.Body as={Link} to={`/posts/${id}`}>
        <Card.Title>{username}</Card.Title>
        <Card.Text>{body}</Card.Text>
        <Button as="div" labelPosition="right" onClick={likePost}>
          <Button color="red" basic>
            <Icon name="heart" />
          </Button>
          <Label as="a" basic color="red" pointing="left">
            {likes.length}
          </Label>
        </Button>
        <Button as="div" labelPosition="right" onClick={comment}>
          <Button color="blue" basic>
            <Icon name="comment" />
          </Button>
          <Label as="a" basic color="blue" pointing="left">
            {comments.length}
          </Label>
        </Button>
        <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
}

export default CardInfo;
