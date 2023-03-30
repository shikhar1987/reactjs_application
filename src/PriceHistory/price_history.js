import "../splunk-instrumentation.js";
import React, { useState, useEffect } from "react";
import "./../main.css";
import "bootstrap/dist/css/bootstrap.css";
import { AgGridReact } from "ag-grid-react";
import Nav_bar from "./../nav";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Line } from "react-chartjs-2";


export default function PriceHistory() {
  const [rowData, setRowData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [symbol, setSymbol] = useState("");

  const [chartData, setData] = useState({});

  const columns = [
    {
      headerName: "Date",
      field: "date",
      sortable: true,
    },
    { headerName: "Open", field: "open", sortable: true },
    {
      headerName: "High",
      field: "high",
      sortable: true,
    },
    { headerName: "Low", field: "low", sortable: true },
    {
      headerName: "Close",
      field: "close",
      sortable: true,
    },
    {
      headerName: "Volumes",
      field: "volumes",
      sortable: true,
    },
  ];

  /**
   * this function updates the chart and set the dafault
   * setting of the chart component
   * @param {the timestamp retrieved from the api} timeLabel 
   * @param {the closing price } closingData 
   */
  const chart = (timeLabel, closingData) => {
    setData({
      labels: timeLabel,
      datasets: [
        {
          label: "closing price",
          fill: false,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          data: closingData,
        },
      ],
    });
  };
  const option = {
    responsive: true,
  };

  /**
   * handles the search button
   * stores the data to ag-grid
   * and updates the chart
   */
  const handleSubmit = async () => {
    let timeLabel = [];
    let resData = [];
    const start = moment(startDate).format().split("T")[0];
    const end = moment(endDate).format().split("T")[0];
    let token = localStorage.getItem("token");
    const api_url =
      `http://${process.env.REACT_APP_BACKEND_ADDRESS}:3002/stocks/authed/${symbol}?from=${start}T00%3A00%3A00.000Z&to=${end}T00%3A00%3A00.000Z`;
    fetch(api_url, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          alert(res.message);
        } else {
          // for every object in the response
          for (const dataObj of res) {
            timeLabel.push(moment(dataObj.timestamp).format().split("T")[0]);
            resData.push(parseFloat(dataObj.close));
          }
          //updates the chart
          chart(timeLabel, resData);

          return res.map((data) => ({
            date: moment(data.timestamp).format().split("T")[0],
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            volumes: data.volumes,
          }));
        }
      })
      .then((data) => {
        setRowData(data);
      });
    setSymbol("");
  };

  let token = localStorage.getItem("token");

  /**
   * if the user has logged in display the price history page
   * else display a text on the page telling the uer to 
   * register
   */
  return (
    <div className="main">
      <h1 id="page_heading">Price history</h1>
      <div className="home-header">
        <Nav_bar />
        <div className="container">
          {token ? (
            <div
              className="ag-theme-balham"
              style={{
                position: "absolute",
                width: 1200,
                height: 300,
                top: "10%",
                left: "5%",
                fontSize: 15,
              }}
            >
              <label id="searchLabel">
                <p> Please enter your desired Symbol </p>
                Symbol:
                <input
                  id="search_input"
                  type="Text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                />
              </label>
              <label id="startDate">
                Start Date:
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </label>
              <label id="endDate">
                End Date:
                <DatePicker
                  id="endDate"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </label>
              <Button id="searchBtn" variant="dark" onClick={handleSubmit}>
                Search
              </Button>
              <AgGridReact
                columnDefs={columns}
                rowData={rowData}
                pagination={true}
                paginationPageSize={8}
              />
              <div id="chart">
                <Line width={800} height={300} data={chartData} options={option} />
              </div>
            </div>
          ) : (
            <h1 style={{ position: "absolute", top: "30%", left: "0%" }}>
              You need to login to view the following information, please login.
            </h1>
          )}
        </div>

      </div>
    </div>
  );

}
