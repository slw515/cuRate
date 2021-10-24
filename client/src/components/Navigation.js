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
    // <Navbar bg="light" expand="lg">
    //   <Nav className="container" style={{ maxHeight: "100px" }} navbarScroll>
    //     <div style={{ display: "flex", flexDirection: "row" }}>
    //       <NavLink to="/" className="nav-link" activeClassName="active">
    //         Home
    //       </NavLink>
    //       <NavLink to="/about" className="nav-link" activeClassName="active">
    //         About
    //       </NavLink>
    //     </div>
    //     <Nav.Item className="d-flex">
    //       <p>Welcome, {user.username}</p>
    //       <Button onClick={logout}>Logout</Button>
    //     </Nav.Item>
    //   </Nav>
    // </Navbar>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">CuRate</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link" activeClassName="active">
              Home
            </NavLink>
            <NavLink to="/about" className="nav-link" activeClassName="active">
              About
            </NavLink>
          </Nav>
          <Nav>
            <p>Welcome, {user.username}</p>
            <Nav.Link>
              <Button onClick={logout}>Logout</Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  ) : (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">CuRate</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link" activeClassName="active">
              Home
            </NavLink>
            <NavLink to="/about" className="nav-link" activeClassName="active">
              About
            </NavLink>
          </Nav>
          <Nav>
            <NavLink
              to="/register"
              className="nav-link"
              activeClassName="active"
            >
              Register
            </NavLink>
            <NavLink to="/login" className="nav-link" activeClassName="active">
              Login
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
