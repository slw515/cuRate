import React, { useState, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { UserContext } from "../contextComponents/auth";
function Register(props) {
  const userContext = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: ""
  });

  const inputChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [addUser, { loading }] = useMutation(USER_REGISTER, {
    update(_, result) {
      userContext.login(result.data.login);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  const submitRegisterForm = event => {
    event.preventDefault();
    addUser();
  };

  return (
    <Container>
      <Form
        onSubmit={submitRegisterForm}
        noValidate
        className={loading ? "loading" : ""}
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={values.email}
            onChange={inputChange}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
            name="username"
            value={values.username}
            onChange={inputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={inputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={inputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}

const USER_REGISTER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
