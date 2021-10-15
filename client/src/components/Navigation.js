import React, { useContext } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { UserContext } from "../contextComponents/auth";
function Navigation() {
  const { logout, user } = useContext(UserContext);
  return user ? (
    <Navbar bg="light" expand="lg">
      <Nav
        className="container-fluid"
        style={{ maxHeight: "100px" }}
        navbarScroll
      >
        <NavLink to="/ " className="nav-link" activeClassName="active">
          CuRate
        </NavLink>
        <Nav.Item className="ms-auto">
          <p>Welcome, {user.username}</p>
        </Nav.Item>
        <Button onClick={logout}>Logout</Button>
        {/* <Nav.Item className="ms-auto">
          <NavLink>Register</NavLink>
        </Nav.Item> */}
      </Nav>
    </Navbar>
  ) : (
    <Navbar bg="light" expand="lg">
      <Nav
        className="container-fluid"
        style={{ maxHeight: "100px" }}
        navbarScroll
      >
        <NavLink to="/ " className="nav-link" activeClassName="active">
          Home
        </NavLink>

        <NavLink to="/login" className="nav-link" activeClassName="active">
          Login
        </NavLink>

        <NavLink to="/register" className="nav-link" activeClassName="active">
          Register
        </NavLink>
        <Nav.Item className="ms-auto">
          <Nav.Link>Hi fname lname!</Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}

export default Navigation;
