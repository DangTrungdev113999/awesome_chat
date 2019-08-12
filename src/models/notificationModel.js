import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: {type: Boolean, default: false},
  createdAt: {type: Number, default: Date.now}
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequsetContactNotification(senderId, receiverId, type) {
    return this.remove({
      $and: [
        {"senderId": senderId},
        {"receiverId": receiverId},
        {"type": type}
      ]
    }).exec();
  },
  getByUserIdAndLimit(userId, limit) {
    return this.find({
      "receiverId": userId
    }).sort({"createdAt": -1}).limit(limit).exec();
  }
};

const NOTIFICATION_TYPE = {
  ADD_CONTACT: "add_contact"
};

const NOTIFICATION_CONTENT = {
  getContent : (notificationType, isRead, userId, userName, userAvatar) => {
    if (notificationType === NOTIFICATION_TYPE.ADD_CONTACT) {
      if (!isRead) {
        return `<span class="notif-readed-faild" data-uid="${ userId }">
                  <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
                  <strong>${ userName }</strong> đã gửi cho bạn một lời mời kết bạn!
                </span><br><br><br>`;
      }
      return `<span data-uid="${ userId }">
                <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
                <strong>${ userName }</strong> đã gửi cho bạn một lời mời kết bạn!
              </span><br><br><br>`;
    };
    return `No matching  any notification type`;
  }
}

module.exports = {
  model: mongoose.model('notification', NotificationSchema),
  type: NOTIFICATION_TYPE,
  contents: NOTIFICATION_CONTENT
};