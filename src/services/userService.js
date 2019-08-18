import UserModel from "./../models/userModel";
import { transErrors } from "../../lang/vi";
import bcrpyt from "bcrypt";

const saltRounds = 7;

/**
 * Update user Info
 * @param {userId} id
 * @param {data Update} item
 */
let updateUser = (id, item) => {
  return UserModel.updateUserItem(id, item);
};

/**
 * updata user password
 * @param {userId} id
 * @param {data update} dataUdpate
 */

let updatePassword = (id, dataUdpate) => {
  return new Promise(async (resolve, reject) => {
    let currentUser = await UserModel.findUserByIdToUpdatePassword(id);
    if (!currentUser) {
      return reject(transErrors.account_undefined);
    }

    let checkCurrentPasssword = await currentUser.comparePassword(dataUdpate.currentPassword);
    if (!checkCurrentPasssword) {
      return reject(transErrors.user_current_password_failded);
    }

    let salt = bcrpyt.genSaltSync(saltRounds);
    await UserModel.updatePassword(
      id,
      bcrpyt.hashSync(dataUdpate.newPassword, salt)
    );
    resolve(true);
  });
};

module.exports = {
  updateUser,
  updatePassword
};
