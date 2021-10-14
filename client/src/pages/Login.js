import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

function Login(props) {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    password: ""
  });

  const inputChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [loginCallback, { loading }] = useMutation(USER_LOGIN, {
    update(_, result) {
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  const loginUserForm = event => {
    event.preventDefault();
    loginCallback();
  };

  return (
    <Container>
      <Form
        onSubmit={loginUserForm}
        noValidate
        className={loading ? "loading" : ""}
      >
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
        <Button variant="primary" type="submit">
          Login
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

const USER_LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      token
    }
  }
`;

export default Login;
