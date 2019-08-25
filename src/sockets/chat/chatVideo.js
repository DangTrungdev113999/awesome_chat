import {
  pushSocketIdToArray,
  emitNotifyToArray,
  reoveSocketIdFromArray
} from "./../../helper/socketHelper";
/**
 *
 * @param {*} io from socket.io lb
 */

let chatVideo = io => {
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

    socket.on("caller-check-listener-online-or-not", data => {
      if (clients[data.listenerId]) {
        //online
        let response = {
          callerId : socket.request.user._id,
          listenerId: data.listenerId,
          callerName: data.callerName
        };
        emitNotifyToArray(
          clients, 
          data.listenerId, 
          io, 
          "server-request-peerId-of-listener",
          response
        );
      } else {
        // ofline
        socket.emit("server-send-listener-is-offline");
      }
    });

    socket.on("listener-emit-peer-id-to-server", data => {
      let response = {
        callerId : data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };
      if (clients[data.callerId]) {
        emitNotifyToArray(
          clients, 
          data.callerId, 
          io, 
          "server-send-peerId-of-listener-to-caller",
          response
        );
      }
    });

    socket.on("caller-request-call-to-server", data => {
      let response = {
        callerId : data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };
      if (clients[data.listenerId]) {
        emitNotifyToArray(
          clients, 
          data.listenerId, 
          io,
          "server-send-request-call-to-listener",
          response
        );
      }
    });

    socket.on("caller-cancel-request-to-server", data => {
      let response = {
        callerId : data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };
      if (clients[data.listenerId]) {
        emitNotifyToArray(
          clients, 
          data.listenerId, 
          io,
          "server-send-cancel-request-call-to-listener",
          response
        );
      }
    });

    socket.on("listener-reject-request-call-to-server", data => {
      let response = {
        callerId : data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };
      if (clients[data.callerId]) {
        emitNotifyToArray(
          clients, 
          data.callerId, 
          io,
          "server-send-reject-call-to-caller",
          response
        );
      }
    });

    socket.on("listener-accept-request-call-to-server", data => {
      let response = {
        callerId : data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };
      if (clients[data.callerId]) {
        emitNotifyToArray(
          clients, 
          data.callerId, 
          io,
          "server-send-accept-call-to-caller",
          response
        );
      }
      if (clients[data.listenerId]) {
        emitNotifyToArray(
          clients, 
          data.listenerId, 
          io,
          "server-send-accept-call-to-listener",
          response
        );
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

module.exports = chatVideo;
