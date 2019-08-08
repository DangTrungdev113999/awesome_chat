import UserModel from './../models/userModel';

/**
 * Update user Info
 * @param {userId} id 
 * @param {data Update} item 
 */
let updateUser = (id, item) => {
  return UserModel.updateUserItem(id, item);
};

module.exports = {
  updateUser
};