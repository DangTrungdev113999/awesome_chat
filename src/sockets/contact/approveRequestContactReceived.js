import {
  pushSocketIdToArray,
  emitNotifyToArray,
  reoveSocketIdFromArray
} from "./../../helper/socketHelper";
/**
 *
 * @param {*} io from socket.io lb
 */

let approveRequestContactReceived = io => {
  let clients = {};

  io.on("connection", socket => {
    let currentUserId = socket.request.user._id;

    clients = pushSocketIdToArray(clients, currentUserId, socket.id);

    socket.on("approve-request-contact-received", data => {
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address: socket.request.user.address ? socket.request.user.address : ""
      };

      // emit notification
      if (clients[data.contactId]) {
        emitNotifyToArray(
          clients,
          data.contactId,
          io,
          "response-approve-request-contact-received",
          currentUser
        );
      }
    });
    socket.on("disconnect", () => {
      // remove socket when user user disconnect
      clients = reoveSocketIdFromArray(clients, currentUserId, socket.id);
    });
  });
};

module.exports = approveRequestContactReceived;
