import addNewContact from './contact/addNewContact';
import removeRequestContact from './contact/removeRequestContact';
/**
 * 
 * @param  io from socket lbrary 
 */
let initSocket = (io) => {
  addNewContact(io);
  removeRequestContact(io);
};

module.exports = initSocket;
