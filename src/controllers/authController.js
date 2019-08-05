import {validationResult} from 'express-validator/check';

let getLoginRegister = (req, res) => {
  return res.render('auth/master');
};

let postRegister = (req, res) => {
  let errorArr = []
  let validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(error => {
      errorArr.push(error.msg);
    })
    return;
  }

  console.log(req.body);
};

module.exports = {
  getLoginRegister,
  postRegister
};