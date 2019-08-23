import { notification, contact, message } from "./../services/index";
import { bufferToBase64, lastItemOfArray, convertTimestampToHumanTime} from "./../helper/clientHelper";
import request from "request";

let getICETurnServer = () => {
  return new Promise( async(resolve, reject) => {
    // // Node Get ICE STUN and TURN list
    // let o = {
    //   format: "urls"
    // };

    // let bodyString = JSON.stringify(o);

    // let options = {
    //   url: "https://global.xirsys.net/_turn/ProjectNodejs",
    //   method: "PUT",
    //   headers: {
    //     "Authorization": "Basic " + Buffer.from("dangtrungdev113999:56127482-c58b-11e9-9093-0242ac110003").toString("base64"),
    //     "Content-Type": "application/json",
    //     "Content-Length": bodyString.length
    //   }
    // };

    // // call a  request to get ICCE list of turn server
    // request(options, (error, response, body) => {
    //   if (error) {
    //     console.log("Error when get ICCE list" + error);
    //     return reject(error);
    //   } 
    //   let bodyJson = JSON.parse(body);
    //   resolve(bodyJson.v.iceServers);
    // });
    resolve([]);

  });
}

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

  // get all conversation with messages 30 item one time
  let allConversationWithMessages = await getAllConversationItems.allConversationWithMessages;

  //get ICCE list from xirsys turn server
  let iceServerList = await getICETurnServer();

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
    allConversationWithMessages,
    bufferToBase64,
    lastItemOfArray,
    convertTimestampToHumanTime,
    iceServerList: JSON.stringify(iceServerList)
  });
};

module.exports = {
  getHome
};
