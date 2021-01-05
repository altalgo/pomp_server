const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/join', (req, res) => {
  res.render('join', { title: '회원가입 - Pomp' });
});

router.get('/', (req, res, next) => {
  res.render('main', {
    title: 'Pomp',
  });
});

module.exports = router;
