const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { v4: uuidv4 } = require('uuid');

const User = require('../models/user');

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: 'https://pomp.leed.at/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'google' },
          });
          if (exUser) {
            console.log('user exists');
            cb(null, exUser);
          } else {
            const sameEmailUser = await User.findOne({
              where: { email: profile._json.email },
            });
            if (sameEmailUser) {
              sameEmailUser.setDataValue('duplicate', 'yes');
              return cb(null, sameEmailUser, {
                loginError: true,
                message: "Please Login with Method you've joined Pomp",
              });
            }
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
