import ContacModel from './../models/contactModel';
import UserModel from './../models/userModel';
import NotificationModel from './../models/notificationModel';
import _ from 'lodash';

const LIMIT_NUMBER_TAKEN = 10;

let findUsersContact = (currentUserId, keyword) => {
  return new Promise( async (resolve, reject) => {
    let deprecateUserIds =  [currentUserId];
    let contactByUser = await ContacModel.findAllByUser(currentUserId);
    contactByUser.forEach(contact => {
      deprecateUserIds.push(contact.userId);
      deprecateUserIds.push(contact.contactId);
    });

    deprecateUserIds = _.uniqBy(deprecateUserIds);
    let users = await UserModel.findAllForAddContact(deprecateUserIds, keyword);
    resolve(users);
  });
};

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExitsts = await ContacModel.checkExists(currentUserId, contactId);
    if (contactExitsts) {
      return reject(false);
    };

    // create contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };

    let newContact = await ContacModel.createNew(newContactItem);

    // create notification
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.type.ADD_CONTACT
    };

    await NotificationModel.model.createNew(notificationItem);


    resolve(newContact);
  });
};

let removeRequestContact = (userId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContacModel.removeRequestContact(userId, contactId);
    if (removeReq.result.n === 0) {
      return reject(false);
    };

    // remove notification
    let notifTypeAddContact = NotificationModel.type.ADD_CONTACT
    await NotificationModel.model.removeRequsetContactNotification(userId, contactId, notifTypeAddContact);
    resolve(true);
  });
};

let getContacts = (currentUserId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let contacts = await ContacModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);

      let users = contacts.map(async contact => {
        if (contact.contactId == currentUserId) {
          // Something user send add friend to me
          return await UserModel.findUserById(contact.userId);
        }
        // I send add friend to something user
        return await UserModel.findUserById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let getContactsSend = (currentUserId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let contacts = await ContacModel.getContactsSend(currentUserId, LIMIT_NUMBER_TAKEN);

      let users = contacts.map(async contact => {
        return await UserModel.findUserById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let getContactsReceived = (currentUserId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let contacts = await ContacModel.getContactsReceived(currentUserId, LIMIT_NUMBER_TAKEN);

      let users = contacts.map(async contact => {
        return await UserModel.findUserById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContacts = (currentUserId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let count = ContacModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactsSend = (currentUserId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let count = ContacModel.countAllContactsSend(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactsReceived = (currentUserId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let count = ContacModel.countAllContactsReceived(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  findUsersContact,
  addNew,
  removeRequestContact,
  getContacts,
  getContactsSend,
  getContactsReceived,
  countAllContacts,
  countAllContactsSend,
  countAllContactsReceived
};
