const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports = () => {
  passport.use(
    'extLocal',
    new LocalStrategy(
      {
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
      },
      async (email, password, done) => {
        console.log(email, password);
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            if (exUser.provider === 'local') {
              const result = await bcrypt.compare(password, exUser.password);
              if (result) {
                done(null, exUser);
              } else {
                done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
              }
            } else {
              done(null, false, {
                message: '소셜 회원입니다. 소셜 로그인을 진행해주세요.',
              });
            }
          } else {
            done(null, false, { message: '가입되지 않은 회원입니다.' });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
