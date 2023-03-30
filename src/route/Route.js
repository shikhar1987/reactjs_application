import "../splunk-instrumentation.js";
import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import App from "../main";
import history from "../history/history";
import Stocks from "../stocks/stocks";
import Quote from "../quote/quote";
import Register from "../user/register";
import Login from "../user/login";
import PriceHistory from "../PriceHistory/price_history";

/**
 * this function does all the routing the application
 */
export default function Routes() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/stocks" component={Stocks} />
        <Route path="/quote/:symbol" component={Quote} />
        <Route path="/quote" component={Quote} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/pricehistory" component={PriceHistory} />
      </Switch>
    </Router>
  );
}
