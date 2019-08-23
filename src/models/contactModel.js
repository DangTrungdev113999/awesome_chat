import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null }
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item); // return Promise so onece will use async/await
  },

  /**
   * find all item that related with user
   * @param {string} userId
   */
  findAllByUser(userId) {
    return this.find({
      $or: [{ userId: userId }, { contactId: userId }]
    }).exec();
  },

  /**
   * check exits of 2 user
   * @param {string} userId
   * @param {string} contactId
   */
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }] },
        { $and: [{ userId: contactId }, { contactId: userId }] }
      ]
    }).exec();
  },

  removeContact(userId, contactId) {
    return this.remove({
      $or: [
        {
          $and: [{ userId: userId }, { contactId: contactId }, { status: true }]
        },
        {
          $and: [{ userId: contactId }, { contactId: userId }, { status: true }]
        }
      ]
    }).exec();
  },

  /**
   *  remove request contact
   * @param {*} userId
   * @param {*} contactId
   */
  removeRequestContactSent(userId, contactId) {
    return this.remove({
      $and: [{ userId: userId }, { contactId: contactId }, { status: false }]
    }).exec();
  },

  removeRequestContactReceived(userId, contactId) {
    return this.remove({
      $and: [{ userId: contactId }, { contactId: userId }, { status: false }]
    }).exec();
  },

  approveRequestContactReceived(userId, contactId) {
    return this.update(
      {
        $and: [{ userId: contactId }, { contactId: userId }, { status: false }]
      },
      { status: true, updatedAt: Date.now() }
    ).exec();
  },

  /**
   * get contacts by userId and limit
   * @param {String} userId
   * @param {Numbar} limit
   */
  getContacts(userId, limit) {
    return this.find({
      $and: [
        {
          $or: [{ userId: userId }, { contactId: userId }]
        },
        { status: true }
      ]
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * get contacts Send by userId and limit
   * I send add friend to something user
   * @param {String} userId
   * @param {Numbar} limit
   */
  getContactsSend(userId, limit) {
    return this.find({
      $and: [{ userId: userId }, { status: false }]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * get contacts Received by userId and limit
   * Something send add friend to me
   * @param {String} userId
   * @param {Numbar} limit
   */

  getContactsReceived(userId, limit) {
    return this.find({
      $and: [{ contactId: userId }, { status: false }]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  countAllContacts(userId) {
    return this.count({
      $and: [
        {
          $or: [{ userId: userId }, { contactId: userId }]
        },
        { status: true }
      ]
    }).exec();
  },

  countAllContactsSend(userId) {
    return this.count({
      $and: [{ userId: userId }, { status: false }]
    }).exec();
  },

  countAllContactsReceived(userId) {
    return this.count({
      $and: [{ contactId: userId }, { status: false }]
    }).exec();
  },

  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true }
      ]
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  },

  readMoreContactsSend(userId, skip, limit) {
    return this.find({
      $and: [{ userId: userId }, { status: false }]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  },

  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [{ contactId: userId }, { status: false }]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  },

  udpateWhenHasNewMessage(userId, contactId) {
    return this.update(
      {
        $or: [
          { $and: [{ userId: userId }, { contactId: contactId }] },
          { $and: [{ userId: contactId }, { contactId: userId }] }
        ]
      },
      {updatedAt: Date.now()}
    ).exec();
  },

  getFriends(userId) {
    return this.find({
      $and: [
        {
          $or: [{ userId: userId }, { contactId: userId }]
        },
        { status: true }
      ]
    })
      .sort({ updatedAt: -1 })
      .exec();
  },
};

module.exports = mongoose.model("contact", ContactSchema);
