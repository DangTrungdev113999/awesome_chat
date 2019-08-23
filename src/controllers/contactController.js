import { contact } from "./../services/index";
import { validationResult } from "express-validator/check";

let findUsersContact = async (req, res) => {
  let errorArr = [];
  let validateErrors = validationResult(req);
  if (!validateErrors.isEmpty()) {
    let errors = Object.values(validateErrors.mapped());
    errors.forEach(error => {
      errorArr.push(error.msg);
    });
    console.log(errorArr);
    return res.status(500).send(errorArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;

    let users = await contact.findUsersContact(currentUserId, keyword);
    return res.render("main/contact/sessions/_findUserscontact", { users });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let addNew = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;
    let newContact = await contact.addNew(currentUserId, contactId);
    return res.status(200).send({ success: !!newContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;
    let removeContact = await contact.removeContact(currentUserId, contactId);
    return res.status(200).send({ success: !!removeContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContactSent = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;
    let removeReq = await contact.removeRequestContactSent(
      currentUserId,
      contactId
    );
    return res.status(200).send({ success: !!removeReq });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeREquestContactReceived = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;
    let removeReq = await contact.removeRequestContactReceived(
      currentUserId,
      contactId
    );
    return res.status(200).send({ success: !!removeReq });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let approveRequestContactReceived = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;
    let approveReq = await contact.approveRequestContactReceived(
      currentUserId,
      contactId
    );
    return res.status(200).send({ success: !!approveReq });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContacts = async (req, res) => {
  try {
    let skipNumberContacts = +req.query.skipNumber;

    let newContactUsers = await contact.readMoreContacts(
      req.user._id,
      skipNumberContacts
    );

    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContactsSend = async (req, res) => {
  try {
    let skipNumberContactsSend = +req.query.skipNumber;

    let newContactUsersSend = await contact.readMoreContactsSend(
      req.user._id,
      skipNumberContactsSend
    );
    return res.status(200).send(newContactUsersSend);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContactsReceived = async (req, res) => {
  try {
    let skipNumberContactsReceived = +req.query.skipNumber;
    let newContactUsersSend = await contact.readMoreContactsReceived(
      req.user._id,
      skipNumberContactsReceived
    );
    return res.status(200).send(newContactUsersSend);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let searchFriends = async (req, res) => {
  let errorArr = [];
  let validateErrors = validationResult(req);
  if (!validateErrors.isEmpty()) {
    let errors = Object.values(validateErrors.mapped());
    errors.forEach(error => {
      errorArr.push(error.msg);
    });
    console.log(errorArr);
    return res.status(500).send(errorArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;

    let users = await contact.searchFriends(currentUserId, keyword);
    return res.render("main/groupChat/session/_searchFriends", { users });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  findUsersContact,
  addNew,
  removeContact,
  removeRequestContactSent,
  removeREquestContactReceived,
  approveRequestContactReceived,
  readMoreContacts,
  readMoreContactsSend,
  readMoreContactsReceived,
  searchFriends
};
