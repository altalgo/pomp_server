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
  const forms = await Form.findAll({ where: { userId: req.user.id } });
  // console.log(forms);
  const headers = forms.map((form) => form.data[0]);
  return res.json({ forms });
});

router.get('/view/:id', async (req, res) => {
  const form = await Form.findOne({ where: { id: req.params.id } });
  // console.log(form);
  return res.json({ form });
});

module.exports = router;
