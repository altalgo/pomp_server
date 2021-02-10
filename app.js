const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

dotenv.config();
const authRouter = require('./routes/auth');
const formRouter = require('./routes/forms');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
app.use(cors());
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8080);

//시퀄라이즈 연결
// sequelize
//   .sync({ force: false })
//   .then(() => {
//     console.log('데이터베이스 연결 성공');
//   })
//   .catch((err) => {
//     console.error(err);
//   });

const sessionStore = new SequelizeStore({
  db: sequelize,
});
sessionStore.sync({ force: false });

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // 배포용
} else {
  app.use(morgan('dev')); // 개발용
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
// https://stackoverflow.com/questions/10476872/setting-a-cookie-for-two-domains
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    cookie: {
      domain: '.leed.at',
      path: '/',
      httpOnly: true,
      secure: false,
    },
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/forms', formRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  // 에러 처리를 어떻게 할 것인지 논의 필요
  res.status(err.status || 500);
  console.error(err);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
  console.log(`http://localhost:${app.get('port')}`);
});
