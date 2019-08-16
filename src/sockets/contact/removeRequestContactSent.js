import {
  pushSocketIdToArray,
  emitNotifyToArray,
  reoveSocketIdFromArray
} from "../../helper/socketHelper";
/**
 *
 * @param {*} io from socket.io lb
 */

let removeRequestContactSent = io => {
  let clients = {};
  io.on("connection", socket => {
    let currentUserId = socket.request.user._id;

    clients = pushSocketIdToArray(clients, currentUserId, socket.id);

    socket.on("remove-request-contact-sent", data => {
      let currentUser = {
        id: socket.request.user._id
      };

      // emit notification
      if (clients[data.contactId]) {
        emitNotifyToArray(
          clients,
          data.contactId,
          io,
          "response-remove-request-contact-sent",
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

module.exports = removeRequestContactSent;
