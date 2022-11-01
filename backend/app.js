require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const options = require("./knexfile.js");
const knex = require("knex")(options);
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const stocksRouter = require("./routes/stocks");
const usersRouter = require("./routes/users");
const homeRouter = require("./routes/home");
//const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");

//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
//const fs = require('fs');
//const https = require("https");
// const privateKey = fs.readFileSync('/etc/ssl/private/node-selfsigned.key', 'utf8');
// const certificate = fs.readFileSync('/etc/ssl/certs/node-selfsigned.crt', 'utf8');
// const credentials = {
//   key: privateKey,
//   cert: certificate
// };
var app = express();
yaml = require("yamljs");
swaggerDocument = yaml.load("./swagger.yaml");
// view engine setup
//configuring the modules
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use((req, res, next) => {
  req.db = knex;
  next();
});
app.use(logger("common"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", homeRouter);
app.use("/stocks", stocksRouter);
app.use("/user", usersRouter);
app.get("/knex", function (req, res, next) {
  req.db
    .raw("SELECT VERSION()")
    .then((version) => console.log(version[0][0]))
    .catch((err) => {
      console.log(err);
      throw err;
    });
  res.send("Version logged successfully");
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
//const server = https.createServer(credentials, app);
//server.listen(443);

module.exports = app;
