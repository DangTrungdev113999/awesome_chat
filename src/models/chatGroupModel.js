import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  usersAmout: { type: Number, min: 3, max: 1999 },
  messagesAmount: { type: Number, default: 0 },
  userId: String,
  menbers: [{ userId: String }],
  createdAt: { type: Number, default: Date.now },
  updatedNow: { type: Number, default: null },
  deletedAt: { type: Number, default: null }
});

ChatGroupSchema.statics = {
  getchatGroups(userId, limit) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}}
    }).sort({"createdAt": -1}).limit(limit).exec();
  }
}

module.exports = mongoose.Schema("chat-group", ChatGroupSchema);
