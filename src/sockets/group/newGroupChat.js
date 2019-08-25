import {
  pushSocketIdToArray,
  emitNotifyToArray,
  reoveSocketIdFromArray
} from "./../../helper/socketHelper";
/**
 *
 * @param {*} io from socket.io lb
 */

let newGroupChat = io => {
  let clients = {};

  io.on("connection", socket => {
    let currentUserId = socket.request.user._id;

    clients = pushSocketIdToArray(clients, currentUserId, socket.id);
    socket.request.user.ChatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });


    socket.on("new-group-created", data => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
      let response = {
        groupChat: data.groupChat
      };

      data.groupChat.menbers.forEach(menber => {
        if (clients[menber.userId] && menber.userId != socket.request.user._id) {
          emitNotifyToArray(clients, menber.userId, io, "response-new-group-created", response);
        }
      });
    });

    socket.on("menber-received-group-chat", data =>  {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on("disconnect", () => {
      // remove socket when user user disconnect
      clients = reoveSocketIdFromArray(clients, currentUserId, socket.id);
      socket.request.user.ChatGroupIds.forEach(group => {
        clients = reoveSocketIdFromArray(clients, group._id, socket.id);
      });
    });
    
  });
};

module.exports = newGroupChat;
