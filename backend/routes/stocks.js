const express = require("express");
const router = express.Router();
const moment = require("moment");
const authorize = require("../functions/authorize.js");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "data" });
});

/**implementing the /symbols route */
router.get("/symbols", function (req, res, next) {
  // check if theres query parameters
  if (Object.keys(req.query).length == 0) {
    req.db
      .from("stocks")
      .select("name", "symbol", "industry")
      .then((rows) => {
        res.json(rows);
      })
      .catch(() => {
        res.status(500).json({ success: true, message: "Fail" });
      });
  } else {
    // if parameter industry is not found
    if (!req.query.industry) {
      res.status(400).json({
        error: true,
        message: "Invalid query parameter: only 'industry' is permitted",
      });
      return;
    }
    req.db
      .from("stocks")
      .select("name", "symbol", "industry")
      .where("industry", "like", "%" + req.query.industry + "%")
      .then((rows) => {
        if (rows.length == 0) {
          res
            .status(404)
            .json({ error: true, message: "Industry sector not found" });
          return;
        } else {
          res.json(rows);
        }
      })
      .catch(() => {
        res.status(500).json({ success: true, message: "Fail" });
      });
  }
});
/**implementing the /symbols/{symbol} route */
router.get("/:symbol", function (req, res, next) {
  var letters = /^[A-Z]+$/;
  // if there is no symbol parameter inputted or user accidentally inputted a query parameter
  if (!req.params.symbol || Object.keys(req.query).length != 0) {
    res.status(400).json({
      error: true,
      message: `Request on /stocks must include symbol as path parameter, 
        or alternatively you can hit /stocks/symbols to get all symbols`,
    });
    return;
    // if there is lower case or parameters' length is over five
  } else if (
    !String(req.params.symbol).match(letters) ||
    String(req.params.symbol).length > 5
  ) {
    res.status(400).json({
      error: true,
      message: "Stock symbol incorrect format - must be 1-5 capital letters",
    });
    return;
  }
  req.db
    .from("stocks")
    .select("*")
    .where("symbol", "=", req.params.symbol)
    .limit(1)
    .then((rows) => {
      if (rows.length == 0) {
        res.status(404).json({
          error: true,
          message: "No entry for symbol in stocks database",
        });
        return;
      } else {
        res.json(rows[0]);
      }
    })
    .catch(() => {
      res.status(500).json({ success: true, message: "Fail" });
    });
});

router.get("/authed/:symbol", authorize, function (req, res, next) {
  // if there is query parameters and user have not inputted a valid query parameters
  if (
    Object.keys(req.query).length != 0 &&
    (!req.query.from || !req.query.to)
  ) {
    res.status(400).json({
      error: true,
      message:
        "Parameters allowed are 'from' and 'to', example: /stocks/authed/AAL?from=2020-03-15",
    });
    return;
    // if there is no query parameters return the latest information of that stock
  } else if (Object.keys(req.query).length == 0) {
    req.db
      .from("stocks")
      .select("*")
      .where("symbol", "=", req.params.symbol)
      .limit(1)
      .then((rows) => {
        if (rows.length == 0) {
          res.status(404).json({
            error: true,
            message: "No entry for symbol in stocks database",
          });
          return;
        } else {
          res.json(rows[0]);
        }
      })
      .catch(() => {
        res.status(500).json({ success: true, message: "Fail" });
      });
    // if the timestamp user inputted is not a valid format
  } else if (
    moment(req.query.from).isValid() &&
    moment(req.query.to).isValid()
  ) {
    let from = moment(req.query.from).format().split("T")[0];
    let to = moment(req.query.to).format().split("T")[0];

    req.db
      .from("stocks")
      .select("*")
      .where("symbol", "=", req.params.symbol)
      .whereBetween("timestamp", [from, to])
      .then((rows) => {
        if (rows.length == 0) {
          res.status(404).json({
            error: true,
            message:
              "No entries available for query symbol for supplied date range",
          });
          return;
        }
        res.json(rows);
      })
      .catch(() => {
        res.status(500).json({ success: true, message: "Fail" });
      });
  } else {
    res.status(400).json({
      error: true,
      message: "From date cannot be parsed by Date.parse()",
    });
    return;
  }
});

module.exports = router;
