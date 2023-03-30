import React from "react";
//import logo from './logo.svg';
import "./splunk-instrumentation.js"
import "./main.css";
import "bootstrap/dist/css/bootstrap.css";
import Nav_bar from "./nav";

/**
 * the main page of the app
 */
export default function App() {
  return (
    <div className="main">
      <h1 id="page_heading"> Home Page</h1>
      <div className="home-header">
        <Nav_bar />
        <div id="about">
          <h1 id="heading">Stock Portal</h1>
          <p id="para">
            Welcome to the QUT stock portal.
            <li>To view available companies press Stocks.</li>
            <li>
              To see the latest price information by stock symbol press Quote by industry.
            </li>
            <li>
              To see recent infromation about a particular stock press Price
              History however you would need to register an account to do that
            </li>
          </p>
        </div>
        <a id="ref" href="https://www.freepik.com/free-photos-vectors/design">
          Design photo created by freepik - www.freepik.com
        </a>
      </div>
    </div>
  );
}
