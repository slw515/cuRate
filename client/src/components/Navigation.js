import React, { useContext } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Container
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { UserContext } from "../contextComponents/auth";
function Navigation() {
  const { logout, user } = useContext(UserContext);
  return user ? (
    <Navbar bg="light" expand="lg">
      <Nav className="container" style={{ maxHeight: "100px" }} navbarScroll>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <NavLink to="/" className="nav-link" activeClassName="active">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link" activeClassName="active">
            About
          </NavLink>
        </div>
        <Nav.Item className="d-flex">
          <p>Welcome, {user.username}</p>
          <Button onClick={logout}>Logout</Button>
        </Nav.Item>
      </Nav>
    </Navbar>
  ) : (
    <Navbar bg="light" expand="lg">
      <Nav className="container" style={{ maxHeight: "100px" }} navbarScroll>
        <NavLink to="/" className="nav-link" activeClassName="active">
          Home
        </NavLink>

        <Nav.Item className="d-flex">
          <NavLink
            to="/register"
            className="nav-link me-2"
            activeClassName="active"
          >
            Register
          </NavLink>
          <NavLink to="/login" className="nav-link" activeClassName="active">
            Login
          </NavLink>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}

export default Navigation;
