import React, { useState, useEffect } from "react";
//import logo from './logo.svg';
import "./main.css";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import history from "./history/history";
import jwt from "jsonwebtoken";

export default function Nav_bar() {
  /*state to check if the user has logged in*/
  const [login, setlogin] = useState(false);
  let token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      setlogin(true);
    }
  });

  const status = jwt.decode(token);

  /*handles the logout action for user*/
  const logout = () => {
    setlogin(false);
    localStorage.removeItem("token");
    history.push("/");
  };
  return (
    <Navbar id="navbar">
      <Navbar.Brand id="navbrand">
        <button id="home_button" onClick={() => history.push("/")}>
          <img
            width="40"
            height="40"
            src={require("./images/qut-logo-og-1200.jpg")}
          />
        </button>
      </Navbar.Brand>
      <Nav className="links">
        <Nav.Link id="home" onClick={() => history.push("/")}>
          Home
        </Nav.Link>
        <Nav.Link id="stocks" onClick={() => history.push("/stocks")}>
          Stocks
        </Nav.Link>
        <Nav.Link id="quote" onClick={() => history.push("/quote")}>
          Quote
        </Nav.Link>
        <Nav.Link
          id="price_history"
          onClick={() => history.push("/pricehistory")}
        >
          Price History
        </Nav.Link>
      </Nav>
      {status ? (
        <Nav className="links2">
          <label id="statusBar">
            <p> Status </p>
            <p>Logged in as : {status.email} </p>
            <p>Token expires in : {status.exp}</p>
          </label>
          <Nav.Link id="logout" onClick={logout}>
            Logout
          </Nav.Link>
        </Nav>
      ) : (
          <Nav className="links2">
            <Nav.Link id="register" onClick={() => history.push("/register")}>
              Register
          </Nav.Link>
            <Nav.Link id="login" onClick={() => history.push("/login")}>
              Login
          </Nav.Link>
          </Nav>
        )}
    </Navbar>
  );
}
