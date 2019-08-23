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

let removeContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeContact = await ContacModel.removeContact(currentUserId, contactId);
    if (removeContact.result.n === 0) {
      return reject(false);
    };

    resolve(true);
  });
};



let removeRequestContactSent = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContacModel.removeRequestContactSent(currentUserId, contactId);
    if (removeReq.result.n === 0) {
      return reject(false);
    };

    // remove notification
    let notifTypeAddContact = NotificationModel.type.ADD_CONTACT
    await NotificationModel.model.removeRequsetContactNotification(currentUserId, contactId, notifTypeAddContact);
    resolve(true);
  });
};

let removeRequestContactReceived = (currentUserId, contactId) => {
  return new Promise( async(resolve, reject) => {
    let removeReq = await ContacModel.removeRequestContactReceived(currentUserId, contactId);
    if(removeReq.result.n === 0) {
      return reject(false);
    };

    // // remove notification
    // let notifTypeAddContact = NotificationModel.type.ADD_CONTACT
    // await NotificationModel.model.removeRequsetContactNotification(currentUserId, contactId, notifTypeAddContact);
    // resolve(true);

    resolve(true);
  });
};

let approveRequestContactReceived = (currentUserId, contactId) => {
  return new Promise( async(resolve, reject) => {
    let approveReq = await ContacModel.approveRequestContactReceived(currentUserId, contactId);
    if (approveReq.nModified === 0) {
      return reject(false);
    };

    // create notification
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.type.APPROVE_CONTACT
    };
    await NotificationModel.model.createNew(notificationItem);

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
          return await UserModel.getNormalUserById(contact.userId);
        }
        // I send add friend to something user
        return await UserModel.getNormalUserById(contact.contactId);
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
        return await UserModel.getNormalUserById(contact.contactId);
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
        return await UserModel.getNormalUserById(contact.userId);
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

let readMoreContacts = (currentUserId, skipNumberContacts) => {
  return new Promise( async(resolve, reject) => {
    try {
      let newContacts = await ContacModel.readMoreContacts(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);

      let users = newContacts.map(async contact => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getNormalUserById(contact.userId);
        };
        return await UserModel.getNormalUserById(contact.contactId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    };
  });
};

let readMoreContactsSend = (currentUserId, skipNumberContactsSend) => {
  return new Promise( async (resolve, reject) => {
    try {
      let newContactsSend = await ContacModel.readMoreContactsSend(currentUserId, skipNumberContactsSend, LIMIT_NUMBER_TAKEN);
      let users = newContactsSend.map( async contact => {
        return await UserModel.getNormalUserById(contact.contactId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContactsReceived = (currentUserId, skipNumberContactsReceived) => {
  return new Promise( async(resolve, reject) => {
    try {
      let newContactsReceived = await ContacModel.readMoreContactsReceived(currentUserId, skipNumberContactsReceived, LIMIT_NUMBER_TAKEN);
      let users = newContactsReceived.map(async contact => {
        return await UserModel.getNormalUserById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let searchFriends = (currentUserId, keyword) => {
  return new Promise( async (resolve, reject) => {
    let friendIds = [];
    let friends = await ContacModel.getFriends(currentUserId);

    friends.forEach((item) => {
      friendIds.push(item.userId);
      friendIds.push(item.contactId)
    });

    friendIds = _.unionBy(friendIds);
    friendIds = friendIds.filter(userId => userId != currentUserId);
    let users = await UserModel.findAllToGroupChat(friendIds, keyword);
    
    resolve(users);
  });
};
module.exports = {
  findUsersContact,
  addNew,
  removeContact,
  removeRequestContactSent,
  removeRequestContactReceived,
  approveRequestContactReceived,
  getContacts,
  getContactsSend,
  getContactsReceived,
  countAllContacts,
  countAllContactsSend,
  countAllContactsReceived,
  readMoreContacts,
  readMoreContactsSend,
  readMoreContactsReceived,
  searchFriends
};
