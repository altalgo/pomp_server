const express = require('express');

const router = express.Router();
router.use('/',(req,res)=>{
  res.send('로그인 성공')
})
router.post('/upload', (req, res) => {
  console.log(req.body);
});

module.exports = router;
