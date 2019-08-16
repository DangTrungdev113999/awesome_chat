import NotificationModel from "./../models/notificationModel";
import UserModel from "./../models/userModel";

const LIMIT_NUMBER_TAKEN = 10;

/**
 *  get Notification when user refresh page
 * @param {*} currentUserId
 * @param {*} limit
 */
let getNotifications = currentUserId => {
  return new Promise(async (resolve, reject) => {
    try {
      let notificattions = await NotificationModel.model.getByUserIdAndLimit(
        currentUserId,
        LIMIT_NUMBER_TAKEN
      );

      let getNotifContent = notificattions.map(async notification => {
        let sender = await UserModel.getNormalUserById(notification.senderId);
        return NotificationModel.contents.getContent(
          notification.type,
          notification.isRead,
          sender._id,
          sender.username,
          sender.avatar
        );
      });

      resolve(await Promise.all(getNotifContent));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * count all notification unread
 * @param {*} currentUserId
 */

let countNotifUnread = currentUserId => {
  return new Promise(async (resolve, reject) => {
    try {
      let noticationUnread = await NotificationModel.model.noticationUnread(
        currentUserId
      );
      resolve(noticationUnread);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * read more notificatin, max 10 item one times
 * @param {String} currentUserId
 * @param {Numcer} skipNumberNotification
 */
let readMore = (currentUserId, skipNumberNotification) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newNotifications = await NotificationModel.model.readMore(
        currentUserId,
        skipNumberNotification,
        LIMIT_NUMBER_TAKEN
      );

      let notifContent = newNotifications.map(async notification => {
        let sender = await UserModel.getNormalUserById(notification.senderId);
        return NotificationModel.contents.getContent(
          notification.type,
          notification.isRead,
          sender._id,
          sender.username,
          sender.avatar
        );
      });

      resolve(await Promise.all(notifContent));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * mark all notification as read
 * @param {String} currentUserId
 * @param {array} targetUsers
 */
let markAllAsRead = (currentUserId, targetUsers) => {
  return new Promise(async (resolve, reject) => {
    try {
      await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
      resolve(true);
    } catch (error) {
      console.log(`Error when mark all notification as read: ${error}`);
      reject(false);
    }
  });
};

module.exports = {
  getNotifications,
  countNotifUnread,
  readMore,
  markAllAsRead
};
