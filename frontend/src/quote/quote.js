import "../splunk-instrumentation.js";
import "./../main.css";
import Nav_bar from "./../nav";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import history from "../history/history";
import { Button } from "react-bootstrap";
import moment from "moment";

/**
 * This quote page allows user to either retrieve
 * the latest stock info through row selecting in 
 * the stock page. 
 * Or
 * Inputting the symbol in the search bar
 * on the Quote page
 */
export default function Quote() {
  // grabs the parameters passed from stocks page
  const { symbol } = useParams();
  //used to store the symbol when user decide to search through the search bar
  const [localSymbol, setSymbol] = useState("");
  // sets the data for the status function
  const [data, setData] = useState([]);

  /**
   * the function takes the object
   * and map it onto the web page
   * @param {object} props 
   */
  const status = (props) => {
    /**
     * handles the reset button
     */
    const handleClick = () => {
      history.push("/quote"); //push back to the original page to reset
      setData([]);// empty the state
      setSymbol("");
    };

    return (
      <div id="results" style={{
        position: "absolute",
        top: "100%",
        left: "0%",
        width: 600,
      }}>
        <p>Timestamp: {props.timestamp}</p>
        <p>Symbol: {props.symbol}</p>
        <p>Name: {props.name}</p>
        <p>Industry: {props.industry}</p>
        <p>Open: {props.open}</p>
        <p>High: {props.high}</p>
        <p>Low: {props.low}</p>
        <p>Close: {props.close}</p>
        <p>Volumes: {props.volumes}</p>
        <Button id="buttons" variant="dark" onClick={handleClick}>
          Reset
        </Button>
      </div>
    );
  };

  /**
   * fetch the api through the search label
   */
  const getData = () => {
    let api_url = `http://${process.env.REACT_APP_STOCK_ADDRESS}/stocks/${localSymbol}`;
    fetch(api_url)
      .then((res) => res.json())
      .then((res) => ({
        //reformating the time field
        timestamp: moment(res.timestamp).format().split("T")[0],
        symbol: res.symbol,
        name: res.name,
        industry: res.industry,
        open: res.open,
        high: res.high,
        low: res.low,
        close: res.close,
        volumes: res.volumes,
      }))
      .then((data) => {
        if (data.close === undefined) {// if no data is returned
          alert("no data is returned from the API check your input");
        } else {
          setData(data);
        }
      })
    setSymbol("");
  };

  /**
   * fetch function 
   * if the user decide to access the quote page through
   * the ag grid
   */
  useEffect(() => {
    let api_url = `http://${process.env.REACT_APP_STOCK_ADDRESS}/stocks/${symbol}`;
    fetch(api_url)
      .then((res) => res.json())
      .then((res) => ({
        timestamp: moment(res.timestamp).format().split("T")[0],
        symbol: symbol,
        name: res.name,
        industry: res.industry,
        open: res.open,
        high: res.high,
        low: res.low,
        close: res.close,
        volumes: res.volumes,
      }))
      .then((data) => {
        setData(data);
      })
      .then(console.log("fetching"))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  /* condition rendering */
  if (symbol === undefined) {
    return (
      <div className="main">
        <h1 id="page_heading"> Quote Page</h1>
        <div className="home-header">
          <div className="container">
            <Nav_bar />
            <label style={{
              position: "absolute",
              top: "18%",
              width: 500,
            }}>
              <p> Please enter your desired Symbol </p>

              Symbol:
              <input
                id="search_input"
                type="Text"
                value={localSymbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
              <Button
                id="buttons1"
                variant="dark"
                type="submit"
                onClick={() => getData(localSymbol)
                }
              >
                Search
              </Button>
              <label>{status(data)}</label>
            </label>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="main">
        <div className="home-header">
          <Nav_bar />
          <label style={{
            position: "absolute",
            top: "23%",
            left: "12%",
            fontSize: "medium",
            width: 100,
          }}>{status(data)}
          </label>
        </div>
      </div>
    );
  }
}
