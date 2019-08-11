import addNewContact from './contact/addNewContact';

/**
 * 
 * @param  io from socket lbrary 
 */
let initSocket = (io) => {
  addNewContact(io);
  // 
};

module.exports = initSocket;
