import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import { Button, Icon } from "semantic-ui-react";
import { UserContext } from "../contextComponents/auth";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

function Comment({ item, postId, commentId }) {
  const { user } = useContext(UserContext);

  const [deletePostOrMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      postId,
      commentId
    }
  });

  return (
    <Card className="commentCard" id={`key-${item.id}`}>
      <Card.Body>
        <Card.Title>{item.username}</Card.Title>
        <Card.Text>{item.body}</Card.Text>
        <Card.Footer>
          <small className="text-muted">{item.createdAt.split("T")[0]}</small>
        </Card.Footer>{" "}
      </Card.Body>
      {user != null && user.username === item.username ? (
        <Button
          className="deleteComment"
          color="red"
          id={item.id}
          onClick={deletePostOrMutation}
        >
          <Icon name="delete" />
        </Button>
      ) : (
        <></>
      )}
    </Card>
  );
}
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

export default Comment;
