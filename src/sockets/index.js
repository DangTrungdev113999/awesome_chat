import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
/**
 * 
 * @param  io from socket lbrary 
 */
let initSocket = (io) => {
  addNewContact(io);
  removeRequestContactSent(io);
};

module.exports = initSocket;
