const express = require('express');

const router = express.Router();

router.post('/upload', (req, res) => {
  console.log(req.body);
});

module.exports = router;
