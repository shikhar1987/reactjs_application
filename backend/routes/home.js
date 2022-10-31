const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', { title: 'CAB230 Haonan Wang n9475389' });
});

module.exports = router;