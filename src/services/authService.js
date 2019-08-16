import UserModal from "./../models/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import { transErrors, transSuccess, transMail } from "./../../lang/vi";
import sendMail from "./../config/mailer";

let saltRounds = 7;

let register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    let userByEmail = await UserModal.findByEmail(email);
    if (userByEmail) {
      if (userByEmail.deletedAt !== null) {
        return reject(transErrors.account_removed);
      }
      if (!userByEmail.local.isActive) {
        return reject(transErrors.account_not_active);
      }
      return reject(transErrors.account_in_use);
    }

    let salt = bcrypt.genSaltSync(saltRounds);
    let userItem = {
      username: email.split("@")[0],
      gender,
      local: {
        email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4()
      }
    };

    let user = await UserModal.createNew(userItem);
    // send email
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    // protocel = http || https, host = localhost:3000
    sendMail(email, transMail.subject, transMail.template(linkVerify))
      .then(success => {
        resolve(transSuccess.userCreated(user.local.email));
      })
      .catch(async error => {
        // remove user
        await UserModal.removeById(user._id);
        console.log(error);
        return reject(transMail.send_fail);
      });
  });
};

let verifyAccount = token => {
  return new Promise(async (resolve, reject) => {
    let userByToken = await UserModal.findByToken(token);
    if (!userByToken) {
      return reject(transErrors.token_undefined);
    }

    await UserModal.verify(token);
    resolve(transSuccess.account_actived);
  });
};

module.exports = {
  register,
  verifyAccount
};
