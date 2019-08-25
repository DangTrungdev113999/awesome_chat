import {
  pushSocketIdToArray,
  emitNotifyToArray,
  reoveSocketIdFromArray
} from "./../../helper/socketHelper";
/**
 *
 * @param {*} io from socket.io lb
 */

let typingOff = io => {
  let clients = {};

  io.on("connection", socket => {
    let currentUserId = socket.request.user._id;

    clients = pushSocketIdToArray(clients, currentUserId, socket.id);
    socket.request.user.ChatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    // when has new group chat
    socket.on("new-group-created", data => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
    });
    socket.on("menber-received-group-chat", data =>  {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on("user-is-not-typing", data => {
      if (data.groupId) {
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id,
        };

        if (clients[data.groupId]) {
          emitNotifyToArray(
            clients,
            data.groupId,
            io,
            "response-user-is-not-typing",
            response
          );
        }
      }

      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
        };
        if (clients[data.contactId]) {
          emitNotifyToArray(
            clients,
            data.contactId,
            io,
            "response-user-is-not-typing",
            response
          );
        }

      }

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

module.exports = typingOff;
