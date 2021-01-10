const express = require('express');
const Form = require('../models/form');

const router = express.Router();

router.post('/upload', async (req, res) => {
  console.log(req.user);
  const { session, data } = req.body;
  try {
    await Form.create({
      session,
      data,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/view', async (req, res) => {
  const forms = await Form.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
  });
  // console.log(forms);
  const headers = forms.map((form) => {
    const createdAt = form.createdAt.toISOString();
    // const date =
    //   createdAt.getFullYear() +
    //   '.' +
    //   (createdAt.getMonth() + 1) +
    //   '.' +
    //   createdAt.getDate();
    // const timestmap =
    //   cratedAt.getHours() +
    //   ':' +
    //   cratedAt.getMinutes() +
    //   ':' +
    //   cratedAt.getSeconds();
    // console.log(createdAt)
    const date = createdAt.split('T')[0];
    const timestamp = createdAt.split('T')[1].split('.')[0];
    // 제잘못인가요crated?
    return {
      id: form.id,
      data: form.data[0],
      date,
      timestamp,
    };
  });
  return res.json({ headers });
});

router.get('/view/:id', async (req, res) => {
  const form = await Form.findOne({ where: { id: req.params.id } });
  console.log(form);
  return res.json({ form });
});

module.exports = router;
