import {check} from 'express-validator/check';
import {tranValidation} from './../../lang/vi';

let updateInfo = [
  check("username", tranValidation.update_username)
    .optional()
    .isLength({min:3, max:17})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
  check("gender", tranValidation.update_gender)
    .optional()
    .isIn(["male", "female"]),
  check("address", tranValidation.update_address)
    .optional()
    .isLength({min:3, max:30}),
  check("phone", tranValidation.update_phone)
    .optional()
    .matches(/^(0)[0-9]{9,10}$/)
];

module.exports = {
  updateInfo
}