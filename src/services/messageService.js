import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import _ from "lodash";
import { transErrors } from "./../../lang/vi";
import { app } from "./../config/app";

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
      let allConversationWithMessagesPromise = allConversations.map(
        async conversation => {
          conversation = conversation.toObject();

          if (conversation.menbers) {
            let getMessages = await MessageModel.model.getMessagesInGroup(
              conversation._id, // id of group
              LIMIT_MESSAGES_TAKEN
            );
            conversation.messages = getMessages;
          } else {
            let getMessages = await MessageModel.model.getMessagesInPersonal(
              currentUserId, // send user
              conversation._id, // received user
              LIMIT_MESSAGES_TAKEN
            );
            conversation.messages = getMessages;
          }

          return conversation;
        }
      );

      let allConversationWithMessages = await Promise.all(
        allConversationWithMessagesPromise
      );
      // sort by updatedAt desending
      allConversationWithMessages = _.sortBy(
        allConversationWithMessages,
        item => -item.updatedAt
      );

      resolve({
        allConversationWithMessages
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @param {Object} sender current user
 * @param {String} receiverId id of an user or a group
 * @param {String} messageVal
 * @param {Boolean} isChatGroup
 */
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(
          receiverId
        );
        if (!getChatGroupReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        let received = {
          id: getChatGroupReceiver._id, // = receiverId
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: received.id,
          conversationType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: received,
          text: messageVal,
          createdAt: Date.now()
        };

        // create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);

        // updated group chat to sort by updated
        await ChatGroupModel.udpateWhenHasNewMessage(
          getChatGroupReceiver._id,
          getChatGroupReceiver.messagesAmount + 1
        );
        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getNormalUserById(receiverId);
        if (!getUserReceiver) {
          return reject(transErrors.conversation_not_found);
        }

        let received = {
          id: getUserReceiver._id, // = receiverId
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: received.id,
          conversationType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: received,
          text: messageVal,
          createdAt: Date.now()
        };

        // create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);

        // update to contact when has new message
        await ContactModel.udpateWhenHasNewMessage(
          sender.id,
          getUserReceiver._id
        );
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems,
  getAllConversationItems,
  addNewTextEmoji
};
