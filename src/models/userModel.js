import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { user } from "../services";

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null }
});

// Schema.statics is just find oun record
UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },
  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
  findByToken(token) {
    return this.findOne({ "local.verifyToken": token }).exec();
  },
  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token },
      { "local.isActive": true, "local.verifyToken": null }
    ).exec();
  },
  findUserByIdToUpdatePassword(id) {
    return this.findById(id).exec();
  },
  findUserByIdForSessionToUse(id) {
    return this.findById(id, {"local.password": 0}).exec();
  },
  findUserByFacebookUid(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },
  findUserByGoogleUid(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },
  updateUserItem(id, item) {
    return this.findByIdAndUpdate(id, item).exec(); // after update mongoose will return old data
  },
  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, {
      "local.password": hashedPassword
    }).exec();
  },
  /**
   * find all user for contact
   * @param {array} deprecateUserIds
   * @param {string} keyword
   */
  findAllForAddContact(deprecateUserIds, keyword) {
    return this.find(
      {
        $and: [
          { _id: { $nin: deprecateUserIds } },
          { "local.isActive": true },
          {
            $or: [
              { username: { $regex: new RegExp(keyword, "i") } },
              { "local.email": { $regex: new RegExp(keyword, "i") } },
              { "facebook.email": { $regex: new RegExp(keyword, "i") } },
              { "google.email": { $regex: new RegExp(keyword, "i") } }
            ]
          }
        ]
      },
      { _id: 1, username: 1, address: 1, avatar: 1 }
    ).exec();
  },

  getNormalUserById(id) {
    return this.findById(id, {
      _id: 1,
      username: 1,
      avatar: 1,
      address: 1
    }).exec();
  },

  findAllToGroupChat(friendIds, keyword) {
    return this.find(
      {
        $and: [
          { _id: { $in: friendIds } },
          { "local.isActive": true },
          {
            $or: [
              { username: { $regex: new RegExp(keyword, "i") } },
              { "local.email": { $regex: new RegExp(keyword, "i") } },
              { "facebook.email": { $regex: new RegExp(keyword, "i") } },
              { "google.email": { $regex: new RegExp(keyword, "i") } }
            ]
          }
        ]
      },
      { _id: 1, username: 1, address: 1, avatar: 1 }
    ).exec();
  },
};

// Schema.methods is  find oun record and using it
UserSchema.methods = {
  comparePassword(password) {
    // return a promise, has result true or false
    return bcrypt.compare(password, this.local.password);
  }
};

module.exports = mongoose.model("user", UserSchema);
