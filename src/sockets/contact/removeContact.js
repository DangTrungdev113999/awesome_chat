import {
  pushSocketIdToArray,
  emitNotifyToArray,
  reoveSocketIdFromArray
} from "./../../helper/socketHelper";

let removeContact = io => {
  let clients = {};
  io.on("connection", socket => {
    let currentUserId = socket.request.user._id;

    clients = pushSocketIdToArray(clients, currentUserId, socket.id);

    socket.on("remove-contact", data => {
      let currentUser = {
        id: socket.request.user._id
      };
      if (clients[data.contactId]) {
        emitNotifyToArray(
          clients,
          data.contactId,
          io,
          "response-remove-contact",
          currentUser
        );
      }
    });

    socket.on("disconnect", () => {
      reoveSocketIdFromArray(clients, currentUserId, socket.id);
    });
  });
};

module.exports = removeContact;
