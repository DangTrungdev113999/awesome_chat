import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import approveRequestContactReceived from './contact/approveRequestContactReceived';
/**
 * 
 * @param  io from socket lbrary 
 */
let initSocket = (io) => {
  addNewContact(io);
  removeRequestContactSent(io);
  removeRequestContactReceived(io);
  approveRequestContactReceived(io);
};

module.exports = initSocket;
