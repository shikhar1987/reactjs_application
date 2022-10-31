const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  // if no email or no password
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "request body incomplete - email and password needed",
    });
    return;
  }
  req.db
    .from("users")
    .select("*")
    .where("email", "=", email)
    .then((users) => {
      if (users.length > 0) {
        res.status(409).json({ success: true, message: "User already exists!" });
        return;
      }
      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);
      return req.db.from("users").insert({ email, hash });
    })
    .then(() => {
      res.status(201).json({ success: true, message: "User Created" });
    }).catch(() => {
      res.status(500).json({ success: true, message: "Fail" });
    });
});

router.post("/login", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "request body incomplete - email and password needed",
    });
    return;
  }
  req.db
    .from("users")
    .select("*")
    .where("email", "=", email)
    .then((users) => {
      if (users.length == 0) {
        res.status(401).json({ success: true, message: "Incorrect email or password" });
        return;
      }
      const user = users[0];
      return bcrypt.compare(password, user.hash);
    })
    .then((match) => {
      if (!match) {
        res.status(401).json({ success: true, message: "Incorrect email or password" });
        return;
      }
      const secretKey = process.env.SECRET_KEY;
      const expires_in = 60 * 60 * 24;
      const exp = Date.now() + expires_in * 1000;
      const token = jwt.sign({ email, exp }, secretKey);
      res.json({ token_type: "Bearer", token, expires_in });
    }).catch(() => {
      res.status(500).json({ success: true, message: "Fail" });
    });
});



module.exports = router;
