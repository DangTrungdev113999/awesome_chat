import {contact} from './../services/index';
import {validationResult} from 'express-validator/check';

let findUsersContact = async (req, res) => {
  let errorArr = [];
  let validateErrors = validationResult(req);
  if (!validateErrors.isEmpty()) {
    let errors = Object.values(validateErrors.mapped());
    errors.forEach( error => {
      errorArr.push(error.msg);
    });
    console.log(errorArr);
    return res.status(500).send(errorArr);
  };


  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;

    let users = await contact.findUsersContact(currentUserId, keyword);
    console.log(users);
    return res.render("main/contact/sessions/_findUserscontact", {users});
  } catch (error) {
    return res.status(500).send(error);
  };
};

module.exports = {
  findUsersContact
};