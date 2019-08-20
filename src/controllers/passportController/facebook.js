import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "./../../models/userModel";
import ChatGroup from "./../../models/chatGroupModel";
import { transErrors, transSuccess } from "./../../../lang/vi";

let FacebookStrategy = passportFacebook.Strategy;

/**
 * valid user account type: facebook
 */
let fbAppId = process.env.FB_ID;
let fbAppSecret = process.env.FB_APP_SECRET;
let fbCallbackUrl = process.env.FB_CALLBACK_URL;

let initPassportFacebook = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: fbAppId,
        clientSecret: fbAppSecret,
        callbackURL: fbCallbackUrl,
        passReqToCallback: true,
        profileFields: ["email", "gender", "displayName"] // The field Which I want to take on fb
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findUserByFacebookUid(profile.id);
          if (user) {
            return done(
              null,
              user,
              req.flash("success", transSuccess.loginSuccess(user.username))
            );
          }

          let newUserItem = {
            username: profile.displayName,
            gender: profile.gender,
            local: { isActive: true },
            facebook: {
              uid: profile.id,
              token: accessToken,
              email: `${profile.provider}@gmail.com`
            }
          };

          let newUser = await UserModel.createNew(newUserItem);
          return done(
            null,
            newUser,
            req.flash("success", transSuccess.loginSuccess(newUser.username))
          );
        } catch (error) {
          console.log(error);
          return done(
            null,
            false,
            req.flash("errors", transErrors.server_error)
          );
        }
      }
    )
  );

  // save userId to session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // this is called by passport.session();
  // return userInfo and assign  req.user
  // recieved id form serializeUser
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await UserModel.findUserByIdForSessionToUse(id);
      let getChatGroupIds = await ChatGroup.getChatGroupIdsByUser(user._id);

      user = user.toObject();
      user.ChatGroupIds = getChatGroupIds

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  });
};

module.exports = initPassportFacebook;
