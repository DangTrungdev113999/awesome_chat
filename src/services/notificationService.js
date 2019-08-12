import NotificationModel from './../models/notificationModel';
import UserModel from './../models/userModel';

/**
 *  get Notification when user refresh page
 * @param {*} currentUserId 
 * @param {*} limit 
 */
let getNotifications = (currentUserId, limit = 10) => {
  return new Promise( async(resolve, reject) => {
    try {
      let notificattions = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit);

      let getNotifContent = notificattions.map(async notification => {
        let sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });

      resolve(await Promise.all(getNotifContent));
    } catch (error) {
      reject(error);
    }
  })
};

module.exports = {
  getNotifications
};