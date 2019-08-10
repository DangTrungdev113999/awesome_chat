import ContacModel from './../models/contactModel';
import UserModel from './../models/userModel';
import _ from 'lodash';

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

    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };

    let newContact = await ContacModel.createNew(newContactItem);
    resolve(newContact);
  });
};

let removeRequestContact = (userId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContacModel.removeRequestContact(userId, contactId);
    if (removeReq.result.n === 0) {
      return reject(false);
    };
    resolve(true);
  });
};

module.exports = {
  findUsersContact,
  addNew,
  removeRequestContact
};