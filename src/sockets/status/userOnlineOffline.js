import {
  pushSocketIdToArray,
  emitNotifyToArray,
  reoveSocketIdFromArray
} from "./../../helper/socketHelper";
/**
 *
 * @param {*} io from socket.io lb
 */

let userOnlineOffline = io => {
  let clients = {};

  io.on("connection", socket => {
    let currentUserId = socket.request.user._id;

    clients = pushSocketIdToArray(clients, currentUserId, socket.id);
    socket.request.user.ChatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    let listUserOnline = Object.keys(clients);
    // step 01: Emit to user after login or f5 web page
    socket.emit("server-send-when-list-user-online", listUserOnline);

    // step 02: Emit to all another user when has user online
    socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);

    socket.on("disconnect", () => {
      // remove socket when user user disconnect
      clients = reoveSocketIdFromArray(clients, currentUserId, socket.id);
      socket.request.user.ChatGroupIds.forEach(group => {
        clients = reoveSocketIdFromArray(clients, group._id, socket.id);
      });
      //step 03:  Emit to all another user when has user offline
      socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);
    });
    
  });
};

module.exports = userOnlineOffline;
