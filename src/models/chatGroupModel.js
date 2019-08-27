import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  userAmount: { type: Number, min: 3, max: 1999 },
  messagesAmount: { type: Number, default: 0 },
  userId: String,
  menbers: [{ userId: String }],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null }
});

ChatGroupSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  
  getChatGroups(userId, limit) {
    return this.find({
      menbers: { $elemMatch: { userId: userId } }
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec();
  },

  getChatGroupById(id) {
    return this.findById(id).exec();
  },

  /**
   * update chat group when has message
   * @param {String} id 
   * @param {Number} newMessageAmout 
   */
  udpateWhenHasNewMessage(id, newMessageAmout) {
    return this.findByIdAndUpdate(id, {
      messagesAmount: newMessageAmout,
      updatedAt: Date.now()
    }).exec();
  },

  getChatGroupIdsByUser(userId) {
    return this.find({
      menbers: {$elemMatch: {userId: userId}}
    }, {_id: 1}).exec();
  },


  readMoreChatGroups(userId, skip, limit) {
    return this.find({
      menbers: { $elemMatch: { userId: userId } }
    })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

module.exports = mongoose.model("chat-group", ChatGroupSchema);
