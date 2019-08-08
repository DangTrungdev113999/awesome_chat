import UserModel from './../models/userModel';

// update user info
let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
};

module.exports = {
  updateUser
};