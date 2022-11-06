import "../splunk-instrumentation.js";
import React, { useState } from "react";
import "./../main.css";
import "bootstrap/dist/css/bootstrap.css";
import { AgGridReact } from "ag-grid-react";
import Nav_bar from "./../nav";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { Badge } from "reactstrap";
import { Dropdown } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import history from "../history/history";

export default function Stocks() {
  const [rowData, setRowData] = useState([]);

  const defaultColDef = [
    {
      flex: 1,
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 10,
    },
  ];
  /*an object for setting up the Ag-grid */
  const columns = [
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains"],
        textFormatter: function (r) {
          if (r == null) return null;
          return r
            .toLowerCase()
            .replace(/\s/g, "")
            .replace(/[àáâãäå]/g, "a")
            .replace(/æ/g, "ae")
            .replace(/ç/g, "c")
            .replace(/[èéêë]/g, "e")
            .replace(/[ìíîï]/g, "i")
            .replace(/ñ/g, "n")
            .replace(/[òóôõö]/g, "o")
            .replace(/œ/g, "oe")
            .replace(/[ùúûü]/g, "u")
            .replace(/[ýÿ]/g, "y")
            .replace(/\W/g, "");
        },
        debounceMs: 0,
        caseSensitive: true,
        suppressAndOrCondition: true,
      },
    },
    { headerName: "Symbol", field: "symbol", sortable: true, filter: true, },
    {
      headerName: "Industry",
      field: "industry",
      sortable: true,

    },
  ];
  /*object for dropdown menu */
  const indstries = [
    {
      key: "Health Care",
      text: "Health Care",
      value: "Health Care",
    },
    {
      key: "Financials",
      text: "Financials",
      value: "Financials",
    },
    {
      key: "Industrials",
      text: "Industrials",
      value: "Industrials",
    },
    {
      key: "Real Estate",
      text: "Real Estate",
      value: "Real Estate",
    },
    {
      key: "Consumer Discretionary",
      text: "Consumer Discretionary",
      value: "Consumer Discretionary",
    },
    {
      key: "Materials",
      text: "Materials",
      value: "Materials",
    },
    {
      key: "Information Technology",
      text: "Information Technology",
      value: "Information Technology",
    },
    {
      key: "Energy",
      text: "Energy",
      value: "Energy",
    },
    {
      key: "Consumer Staples",
      text: "Consumer Staples",
      value: "Consumer Staples",
    },
    {
      key: "Telecommunication Services",
      text: "Telecommunication Services",
      value: "Telecommunication Services",
    },
    {
      key: "Utilities",
      text: "Utilities",
      value: "Utilities",
    },
  ];
  /**
   * gets the companies by industry
   * @param {passes through the industry name} event 
   */
  const get_industry = (event) => {
    let industry_name = event.target.textContent;
    let api_url = `http://${process.env.REACT_APP_STOCK_ADDRESS}/stocks/symbols?industry=${industry_name}`;
    fetch(api_url)
      .then((res) => res.json())
      .then((res) =>
        res.map((data) => {
          return {
            name: data.name,
            symbol: data.symbol,
            industry: data.industry,
          };
        })
      )
      .then((data) => setRowData(data))
      .then(console.log("fetching"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="main">
      <h1 id="page_heading"> Stocks Page</h1>
      <div className="home-header">
        <Nav_bar />
        <div className="container">

          <div
            className="ag-theme-balham"
            style={{
              width: 600,
              height: 580,
              fontSize: 15,
              position: "absolute",
              top: "8%",
            }}
          >
            <p>Please Select your desired industry </p>
            <Badge color="success" >{rowData.length}</Badge> results returned

            <Dropdown
              id="Dropdown"
              placeholder="Select An Industry"
              fluid
              selection
              options={indstries}
              onChange={get_industry}
            />
            <AgGridReact
              defaultColDef={defaultColDef}
              columnDefs={columns}
              rowData={rowData}
              pagination={true}
              paginationPageSize={18}
              onRowClicked={(row) => history.push(`/quote/${row.data.symbol}`)}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
