import "../splunk-instrumentation.js";
import "./../main.css";
import Nav_bar from "./../nav";
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import history from "../history/history";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const api_url = `http://${process.env.REACT_APP_USERS_ADDRESS}/user/register`;
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password: password }),
    });
    const jsonReponse = await response.json();
    console.log(jsonReponse);
    if (jsonReponse.success) {
      alert(
        jsonReponse.message
      );
      history.push("/login");
    } else {
      alert(jsonReponse.message);
    }
    setUsername("");
    setPassword("");
  };

  return (
    <div className="main">
      <h1 id="page_heading"> Register Page</h1>
      <div className="home-header">
        <div className="container"></div>
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
          <Button id="button_register" variant="dark" onClick={handleRegister}>
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
}
