const express = require('express');
const Form = require('../models/form');

const router = express.Router();

// router.post('/upload', async (req, res) => {
//   console.log(req.user);
//   const { session, data } = req.body;
//   try {
//     await Form.create({
//       session,
//       data,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

router.get('/view', async (req, res) => {
  // if (!req.user) return res.end('bad request')
try{
  console.log('req.user at /forms', req.user)
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
}catch(err){
  console.log(err);
}
    
});

router.get('/view/:id', async (req, res) => {
  const form = await Form.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });
  console.log(form);
  if (form) return res.json({ form });
  else {
    return res.json({
      form: {
        data: [
          {
            type: -1,
            title: '잘못된 접근입니다',
          },
        ],
      },
    });
  }
});

module.exports = router;

// Form {
//   dataValues: {
//     id: 16,
//     session: 'hihi',
//     data: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//     createdAt: 2021-01-10T07:34:29.000Z,
//     updatedAt: 2021-01-10T07:34:29.000Z,
//     deletedAt: null,
//     UserId: 15
//   },
//   _previousDataValues: {
//     id: 16,
//     session: 'hihi',
//     data: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//     createdAt: 2021-01-10T07:34:29.000Z,
//     updatedAt: 2021-01-10T07:34:29.000Z,
//     deletedAt: null,
//     UserId: 15
//   },
//   _changed: Set {},
//   _options: {
//     isNewRecord: false,
//     _schema: null,
//     _schemaDelimiter: '',
//     raw: true,
//     attributes: [
//       'id',
//       'session',
//       'data',
//       'createdAt',
//       'updatedAt',
//       'deletedAt',
//       'UserId'
//     ]
//   },
//   isNewRecord: false
// }
