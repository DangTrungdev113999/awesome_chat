import { notification, contact, message } from "./../services/index";
import { bufferToBase64 } from "./../helper/clientHelper";

let getHome = async (req, res) => {
  //only (10 item one time)
  let notifications = await notification.getNotifications(req.user._id);

  //get amout notification unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  // get contacts (10 item one time)
  let contacts = await contact.getContacts(req.user._id);

  // get contactsSend (10 item one time)
  let contactsSend = await contact.getContactsSend(req.user._id);

  // get contactsReceived (10 item one time)
  let contactsReceived = await contact.getContactsReceived(req.user._id);

  // countContacts
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSend = await contact.countAllContactsSend(req.user._id);
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  // get conversation 15 item one time
  let getAllConversationItems = await message.getAllConversationItems(req.user._id);
  let userConversations = await getAllConversationItems.userConversations;
  let groupConversations = await getAllConversationItems.groupConversations;
  let allConversations = await getAllConversationItems.allConversations;
  // get all conversation with messages 30 item one time
  let allConversationWithMessages = await getAllConversationItems.allConversationWithMessages;
  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications,
    countNotifUnread,
    contacts,
    contactsSend,
    contactsReceived,
    countAllContacts,
    countAllContactsSend,
    countAllContactsReceived,
    userConversations,
    groupConversations,
    allConversations,
    allConversationWithMessages,
    bufferToBase64
  });
};

module.exports = {
  getHome
};
