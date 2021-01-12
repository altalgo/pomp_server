const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { v4: uuidv4 } = require('uuid');

const User = require('../models/user');

module.exports = () => {
  passport.use('extGoogle',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: 'https://pompserver.leed.at/api/auth/extgoogle/callback',
      },
      async (accessToken, refreshToken, profile, cb) => {
        // console.log('google profile', profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'google' },
          });
          if (exUser) {
            console.log('user exists');
            cb(null, exUser);
          } else {
            console.log('no user');
            const userUUID = uuidv4();
            const newUser = await User.create({
              email: profile._json.email,
              nick: profile.displayName,
              snsId: profile.id,
              userUUID,
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
