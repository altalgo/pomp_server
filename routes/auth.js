const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.json({ error: '해당 유저가 이미 존재합니다' });
    }
    const hash = await bcrypt.hash(password, 12);
    const userUUID = uuidv4();
    await User.create({
      email,
      nick,
      password: hash,
      userUUID,
    });
    return res.json({ joinSuccess: true });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  console.log(req.body);
  passport.authenticate(
    'local',
    {
      successRedirect: '/forms',
      failureRedirect: '/',
      badRequestMessage: '로그인 정보를 입력해주세요',
    },
    (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.json({
          loginSuccess: false,
          error: info.message,
        });
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        } else {
          // 세션 쿠키를 브라우저로 보낸다.
          req.session.save((err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ loginSuccess: true });
          });
        }
      });
    }
  )(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('connect.sid');
  req.session.destroy(() => {
    res.json({ logoutSuccess: true });
  });
});

router.get('/user', (req, res) => {
  // console.log(req.user);
  if (req.user) {
    return res.json({ username: req.user.nick, isAuth: true, user: req.user.userUUID });
  }
  return res.json({ isAuth: false });
});

router.get('/kakao', passport.authenticate('kakao'));
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    // return res.redirect('/forms');
    return res.send(
      '<script>window.location.href="http://pomp.leed.at/forms";</script>'
    );
  }
);
router.post('/extlogin', isNotLoggedIn, (req, res, next) => {
  // console.log(req.body);
  passport.authenticate(
    'extLocal',
    {
      badRequestMessage: '로그인 정보를 입력해주세요',
    }, 
    (authError, user, info) => {
      if (authError) {
        console.log('authError')
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        console.log('!user');
        return res.json({
          loginSuccess: false,
          error: info.message,
        });
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.log('loginError')
          console.error(loginError);
          return next(loginError);
        } else {
          // 세션 쿠키를 브라우저로 보낸다.
          req.session.save((err) => {
            if (err) {
              console.log('err')
              console.log(err);
            }
            return res.json({
              loginSuccess: true,
              uuid: req.user.userUUID
            });
          });
        }
      });
    }
  )(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});
router.get('/extkakao', passport.authenticate('extKakao'));
router.get(
  '/extkakao/callback',
  passport.authenticate('extKakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    // return res.redirect('/forms');
    return res.send(`<script>
    chrome.runtime.sendMessage("olhikehcbmkheggemandfhjekkbffiki",
    { msg: "loginedKakao", uuid: "`+ req.user.userUUID + `" },
     function (res) { 
       console.log(res);
      });
      location.href = "https://pomp.leed.at/extloginsuccess";
      </script>`);
  }
);
router.get(
  '/extgoogle',
  passport.authenticate('extGoogle', { scope: ['profile', 'email'] })
);
router.get(
  '/extgoogle/callback',
  passport.authenticate('extGoogle', {
    // failureRedirect: '/',
  }),
  (req, res) => {
    console.log('req.user, before sending cookie', req.user.userUUID);
    // return res.redirect('http://pomp.leed.at/forms');
    return res.send(`<script>
    chrome.runtime.sendMessage("olhikehcbmkheggemandfhjekkbffiki",
    { msg: "loginedGoogle", uuid: "`+ req.user.userUUID + `" },
     function (res) { 
       console.log(res);
      });
      location.href = "https://pomp.leed.at/extloginsuccess";
      </script>`);
  }
);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    // failureRedirect: '/',
  }),
  (req, res) => {
    console.log('req.user, before sending cookie', req.user);
    // return res.redirect('http://pomp.leed.at/forms');
    return res.send(
      '<script>window.location.href="http://pomp.leed.at/forms";</script>'
    );
  }
);

router.post('/emailcheck', async (req, res) => {
  const { email } = req.body;
  const exUser = await User.findOne({ where: { email } });
  if (!exUser) {
    res.json({ status: 'success', message: '사용가능한 이메일 입니다' });
  } else {
    res.json({ status: 'fail', message: '이미 사용중인 이메일 입니다' });
  }
});

module.exports = router;
