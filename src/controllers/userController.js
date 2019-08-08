import multer from 'multer';
import {app} from './../config/app';
import {transErrors, transSuccess } from './../../lang/vi';
import uuidv4 from 'uuid/v4';
import {user} from './../services/index';
import fsExtra from 'fs-extra';

let storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.avatar_directory);
  },
  filename: (req, file, callback) => {
    let math = app.avatar_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type, null);
    };

    let avatarName = `${Data.now()}-${uuidv4()}-${file.originalname}`;
    callback(null, avatarName);
  }
});

let avatarUploadFile = multer({
  storage: storageAvatar,
  limits: {fileSize: app.avater_limit_size}
}).single('avatar');

let updateAvatar = (req, res) => {
  avatarUploadFile(req, res, async (error) => {
    if (error) {
      if(error.message) {
        return res.status(500).send(transErrors.avatar_size);
      };
      return res.status(500).send(error);
    };

    try {
      let updateUserItem = {
        avatar: req.file.filename,
        updateAt: Date.now()
      }
      // update user
      let userUpdate = await user.updateUser(req.user._id, updateUserItem);
      // after update mongoose will return old data

      // remove user
      // await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avater}`);

      let result = {
        message: transSuccess.avatar_updated,
        imageSrc: `images/users/${req.file.avatar}`
      }
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  });
};

module.exports = {
  updateAvatar
};