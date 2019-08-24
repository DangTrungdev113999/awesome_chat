import {check} from "express-validator/check";
import {tranValidation} from "./../../lang/vi";

let addNewGroup = [
  check("arrayIds", tranValidation.add_new_group_users_incorrect)
    .custom((value) => {
      if (!Array.isArray(value)) {
        return false;
      }
      if (value.length < 2 ) {
        return false;
      }
      return true;
    }),

  check("groupChatName", tranValidation.add_new_group_name_incorrect)
    .isLength({min: 1, max: 30})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
];

module.exports = {
  addNewGroup
}