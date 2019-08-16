import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import GroupModel from "./../models/chatGroupModel";

const LINIT_CONVERSATIONS_TAKEN = 15;

let getAllConversationItems = (currentUserId) => {
  return new Promise( async(resolve, reject) => {
    try {
      // let contacts = await ContactModel.getContacts(currentUserId, LINIT_CONVERSATIONS_TAKEN);

      // let userConversationsPromise = contacts.map(async contact => {
      //   if (contact.contactId == currentUserId) {
      //     return await UserModel.getNormalUserById(contact.userId);
      //   }
      //   return await UserModel.getNormalUserById(contact.contactId);
      // });

      // let userConversations = await Promise.all(userConversationsPromise);
      // let groupConversations = await GroupModel.getChatGroups(currentUserId, LINIT_CONVERSATIONS_TAKEN);

      // console.log(userConversations);
      // console.log("------");
      // console.log(groupConversations);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
};

module.exports = {
  getAllConversationItems
}