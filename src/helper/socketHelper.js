export let pushSocketIdToArray = (clients, currentUserId, socketId) => {
  if (clients[currentUserId]) {
    clients[currentUserId].push(socketId);
  } else {
    clients[currentUserId] = [socketId];
  }

  return clients;
};

export let emitNotifyToArray = (clients, contactId, io, eventName, data) => {
  clients[contactId].forEach(socketId =>
    io.sockets.connected[socketId].emit(eventName, data)
  );
};

export let reoveSocketIdFromArray = (clients, currentUserId, socket) => {
  clients[currentUserId] = clients[currentUserId].filter(
    socketId => socketId !== socket
  );
  if (!clients[currentUserId].length) {
    delete clients[currentUserId];
  }

  return clients;
};
