import express from 'express';
import {home, auth} from './../controllers/index';
import {authValid} from './../validation/index';
import passport from 'passport';
import initPassportLocal from './../controllers/passportController/local';
import initPassportFacebook from './../controllers/passportController/facebook';

// init all passport
initPassportLocal();
initPassportFacebook();

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
  }))

  router.get('/auth/facebook', passport.authenticate("facebook", {scope: ['email']}));
  router.get('/auth/facebook/callback', passport.authenticate("facebook", {
    successRedirect: '/',
    failureRedirect: '/login-register',
  }))

  router.get('/', auth.checkLoggedIn, home.getHome);
  router.get('/logout', auth.checkLoggedIn, auth.getLogout);

  return app.use('/', router);
};

module.exports = initRoutes;