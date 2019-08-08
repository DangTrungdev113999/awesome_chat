import express from 'express';
import {home, auth, user} from './../controllers/index';
import {authValid} from './../validation/index';
import passport from 'passport';
import initPassportLocal from './../controllers/passportController/local';
import initPassportFacebook from './../controllers/passportController/facebook';
import intiPassportGoogle from './../controllers/passportController/google';

// init all passport
initPassportLocal();
initPassportFacebook();
intiPassportGoogle();

let router = express.Router();

/**
 * init all routes
 * @param app from exacly express
 */

let initRoutes = app => {
  
  router.get('/login-register', auth.checkloggedOut, auth.getLoginRegister);
  router.post('/register', auth.checkloggedOut, authValid.register, auth.postRegister);
  router.get('/verify/:token', auth.checkloggedOut, auth.verifyAccout);

  router.post('/login', auth.checkloggedOut, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login-register',
    successFlash: true,
    failureFlash: true
  }));

  router.get('/auth/facebook',auth.checkloggedOut, passport.authenticate("facebook", {scope: ['email']}));
  router.get('/auth/facebook/callback',auth.checkloggedOut, passport.authenticate("facebook", {
    successRedirect: '/',
    failureRedirect: '/login-register',
  }));

  router.get('/auth/google',auth.checkloggedOut, passport.authenticate('google', {scope: ['email']}));
  router.get('/auth/google/callback',auth.checkloggedOut, passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login-register'
  }));

  router.get('/', auth.checkLoggedIn, home.getHome);
  router.get('/logout', auth.checkLoggedIn, auth.getLogout);

  router.put('/user/update-avatar', auth.checkLoggedIn, user.updateAvatar);

  return app.use('/', router);
};

module.exports = initRoutes;