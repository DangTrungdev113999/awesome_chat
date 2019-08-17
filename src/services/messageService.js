import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import _ from "lodash";

const LINIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;

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
          getUserCatct.updatedAt = contact.updatedAt;
          return getUserCatct;
        }
        let getUserCatct = await UserModel.getNormalUserById(contact.contactId);
        getUserCatct.updatedAt = contact.updatedAt;
        return getUserCatct;
      });

      let userConversations = await Promise.all(userConversationsPromise);
      let groupConversations = await ChatGroupModel.getChatGroups(
        currentUserId,
        LINIT_CONVERSATIONS_TAKEN
      );

      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, item => -item.updatedAt);

      // get message to apply to screen chat
      let  allConversationWithMessagesPromise = allConversations.map(async conversation => {

        let getMessages = await MessageModel.model.getMessages(
          currentUserId,
          conversation._id,
          LIMIT_MESSAGES_TAKEN
        );
        
        conversation = conversation.toObject();
        conversation.messages = getMessages;

        return conversation;
      });

      let  allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      // sort by updatedAt desending
      allConversationWithMessages = _.sortBy(allConversationWithMessages, item => -item.updatedAt);

      resolve({
        userConversations,
        groupConversations,
        allConversations,
        allConversationWithMessages
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems
};
