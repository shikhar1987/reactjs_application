import "./../main.css";
import Nav_bar from "./../nav";
import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // user's login state
  const [Login, setLogin] = useState(false);

  /**
   * handles action for the login button
   */
  const handleLogin = async () => {
    const api_url = `http://${process.env.REACT_APP_BACKEND_ADDRESS}:3002/user/login`;
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password: password }),
    });
    const jsonReponse = await response.json();

    if (jsonReponse.message) {
      alert(jsonReponse.message);
    } else {
      alert("you have logged in");
      localStorage.setItem("token", jsonReponse.token);
    }
    setUsername("");
    setPassword("");
  };
  const token = localStorage.getItem("token");
  /*check if the user has logged in*/
  useEffect(() => {
    if (token && jwt.decode(token)) {
      setLogin(true);
    }
  });
  return (
    <div className="main">
      <h1 id="page_heading"> Login Page</h1>
      <div className="home-header">
        {Login ? (
          <Nav_bar />
        ) : (
          <React.Fragment>
            <Nav_bar />
            <Form className="reigster_form">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button
                id="button_register"
                variant="dark"
                onClick={handleLogin}
              >
                Login
              </Button>
            </Form>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
