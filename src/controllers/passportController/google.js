import passport from "passport";
import googlePassport from "passport-google-oauth";
import UserModel from "./../../models/userModel";
import ChatGroup from "./../../models/chatGroupModel";
import { transErrors, transSuccess } from "./../../../lang/vi";

let GoogleStrategy = googlePassport.OAuth2Strategy;

/**
  valid user account type: google
*/

let ggAppId = process.env.GG_ID;
let ggAppSecret = process.env.GG_APP_SECRET;
let ggCallbackUrl = process.env.GG_CALLBACK_URL;

let initPassportGoogle = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: ggAppId,
        clientSecret: ggAppSecret,
        callbackURL: ggCallbackUrl,
        passReqToCallback: true,
        profileFields: ["email", "gender", "displayName"]
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findUserByGoogleUid(profile.id);
          if (user) {
            return done(
              null,
              user,
              req.flash("success", transSuccess.loginSuccess(user.username))
            );
          }

          let newUserItem = {
            username: profile.emails[0].value.split("@")[0],
            gender: profile.gender,
            local: { isActive: true },
            google: {
              uid: profile.id,
              token: accessToken,
              email: profile.emails[0].value
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

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser( async (id, done) => {
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

module.exports = initPassportGoogle;
