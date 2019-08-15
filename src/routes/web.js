import express from "express";
import {home, auth, user, contact, notification} from "./../controllers/index";
import {authValid, userValid, contactValid} from "./../validation/index";
import passport from "passport";
import initPassportLocal from "./../controllers/passportController/local";
import initPassportFacebook from "./../controllers/passportController/facebook";
import intiPassportGoogle from "./../controllers/passportController/google";

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
  
  router.get("/login-register", auth.checkloggedOut, auth.getLoginRegister);
  router.post("/register", auth.checkloggedOut, authValid.register, auth.postRegister);
  router.get("/verify/:token", auth.checkloggedOut, auth.verifyAccout);

  router.post("/login", auth.checkloggedOut, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true
  }));

  router.get("/auth/facebook",auth.checkloggedOut, passport.authenticate("facebook", {scope: ["email"]}));
  router.get("/auth/facebook/callback",auth.checkloggedOut, passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register",
  }));

  router.get("/auth/google",auth.checkloggedOut, passport.authenticate("google", {scope: ["email"]}));
  router.get("/auth/google/callback",auth.checkloggedOut, passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  router.get("/", auth.checkLoggedIn, home.getHome);
  router.get("/logout", auth.checkLoggedIn, auth.getLogout);

  router.put("/user/update-avatar", auth.checkLoggedIn, user.updateAvatar);
  router.put("/user/update-info", auth.checkLoggedIn, userValid.updateInfo, user.updateInfo);
  router.put("/user/update-password", auth.checkLoggedIn, userValid.updatePassword ,user.updatePassword);

  router.get("/contact/find-users/:keyword", auth.checkLoggedIn, contactValid.findUserContact , contact.findUsersContact);
  router.post("/contact/add-new", auth.checkLoggedIn, contact.addNew);
  router.delete("/contact/remove-request-contact-sent",  auth.checkLoggedIn, contact.removeRequestContactSent);
  router.put("/contact/approve-request-contact-received", auth.checkLoggedIn, contact.approveRequestContactReceived);
  router.delete("/contact/remove-request-contact-received", auth.checkLoggedIn, contact.removeREquestContactReceived);
  router.get("/contact/read-more-contacts",  auth.checkLoggedIn, contact.readMoreContacts);
  router.get("/contact/read-more-contacts-send",  auth.checkLoggedIn, contact.readMoreContactsSend);
  router.get("/contact/read-more-contacts-received",  auth.checkLoggedIn, contact.readMoreContactsReceived);

  router.get("/notification/read-more", auth.checkLoggedIn, notification.readMore);
  router.put("/notification/mark-all-as-read", auth.checkLoggedIn, notification.markAllAsRead);

  return app.use("/", router);
};

module.exports = initRoutes;