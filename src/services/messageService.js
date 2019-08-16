import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import _ from "lodash";

const LINIT_CONVERSATIONS_TAKEN = 15;

let getAllConversationItems = currentUserId => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(
        currentUserId,
        LINIT_CONVERSATIONS_TAKEN
      );

      let userConversationsPromise = contacts.map(async contact => {
        if (contact.contactId == currentUserId) {
          let getUserCatct = await UserModel.getNormalUserById(contact.userId);
          getUserCatct.createdAt = contact.createdAt;
          return getUserCatct;
        }
        let getUserCatct = await UserModel.getNormalUserById(contact.contactId);
        getUserCatct.createdAt = contact.createdAt;
        return getUserCatct;
      });

      let userConversations = await Promise.all(userConversationsPromise);
      let groupConversations = await ChatGroupModel.getChatGroups(
        currentUserId,
        LINIT_CONVERSATIONS_TAKEN
      );

      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, item => -item.createdAt);
      resolve({
        userConversations,
        groupConversations,
        allConversations
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems
};
