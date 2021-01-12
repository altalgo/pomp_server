const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const google = require('./googleStrategy')
const extGoogle = require('./googleExtStrategy')
const extKakao = require('./kakaoExtStrategy')
const extLocal = require('./localExtStrategy')
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('Serialize User');
    done(null, user.id); // 세션에 user의 id만 저장
  });

  passport.deserializeUser((id, done) => {
    console.log('Deserialize User');
    if(!id){
      console.log('no session cookie');
    }
    User.findOne({
      where: { id },
    })
      .then((user) => {
        console.log('user', user);
        done(null, user)
      }) // req.user, req.isAuthenticated()
      .catch((err) => done(err));
  });
  local();
  kakao();
  google();
  extGoogle();
  extKakao();
  extLocal();
};