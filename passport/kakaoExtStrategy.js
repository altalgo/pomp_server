const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { v4: uuidv4 } = require('uuid');

const User = require('../models/user');

module.exports = () => {
  passport.use('extKakao',
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: 'https://pompserver.leed.at/api/auth/extkakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log('kakao profile', profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'kakao' },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const sameEmailUser = await User.findOne({
              where: { email: profile._json.kakao_account.email },
            });
            if (sameEmailUser) {
              // 카카오로 가입하진 않았지만 local or 구글 계정이
              // 동일한 이메일로 존재해서 그냥 로그인 시켜줌
              // done(null, sameEmailUser);
            }
            const userUUID = uuidv4();
            const newUser = await User.create({
              email: profile._json.kakao_account.email,
              nick: profile.displayName,
              snsId: profile.id,
              userUUID,
              provider: 'kakao',
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
