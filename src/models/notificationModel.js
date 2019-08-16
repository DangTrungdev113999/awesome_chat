import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now }
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequsetContactNotification(senderId, receiverId, type) {
    return this.remove({
      $and: [{ senderId: senderId }, { receiverId: receiverId }, { type: type }]
    }).exec();
  },
  getByUserIdAndLimit(userId, limit) {
    return this.find({
      receiverId: userId
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * count all notification unread
   * @param {*} userId
   */
  noticationUnread(userId) {
    return this.count({
      $and: [{ receiverId: userId }, { isRead: false }]
    }).exec();
  },

  /**
   * read more notificatin, max 10 item one times
   * @param {String} userId
   * @param {Number} skip
   * @param {Number} limit
   */
  readMore(userId, skip, limit) {
    return this.find({
      receiverId: userId
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  },

  /**
   * mark all notification as read
   * @param {String} userId
   * @param {Array} targetId
   */
  markAllAsRead(userId, targetId) {
    return this.updateMany(
      {
        $and: [{ receiverId: userId }, { senderId: { $in: targetId } }]
      },
      { isRead: true }
    ).exec();
  }
};

const NOTIFICATION_TYPE = {
  ADD_CONTACT: "add_contact",
  APPROVE_CONTACT: "approve_contact"
};

const NOTIFICATION_CONTENT = {
  getContent: (notificationType, isRead, userId, userName, userAvatar) => {
    if (notificationType === NOTIFICATION_TYPE.ADD_CONTACT) {
      if (!isRead) {
        return `<div class="notif-readed-faild" data-uid="${userId}">
                  <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                  <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
      }
      return `<div data-uid="${userId}">
                <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
              </div>`;
    }

    if (notificationType === NOTIFICATION_TYPE.APPROVE_CONTACT) {
      if (!isRead) {
        return `<div class="notif-readed-faild" data-uid="${userId}">
                  <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                  <strong>${userName}</strong> đã chấp nhận lời mời kết bạn của bạn!
                </div>`;
      }
      return `<div data-uid="${userId}">
                <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                <strong>${userName}</strong> đã chấp nhận lời mời kết bạn của bạn!
              </div>`;
    }
    return `No matching  any notification type`;
  }
};

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  type: NOTIFICATION_TYPE,
  contents: NOTIFICATION_CONTENT
};
