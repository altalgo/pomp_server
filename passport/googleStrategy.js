const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: 'http://localhost:8080/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, cb) => {
        console.log('google profile', profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'google' },
          });
          if (exUser) {
            cb(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile._json.email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: 'google',
            });
            cb(null, newUser);
          }
        } catch (error) {
          console.error(error);
          cb(error);
        }
      }
    )
  );
};
//GET /api/auth/google 라우터가 없습니다.
