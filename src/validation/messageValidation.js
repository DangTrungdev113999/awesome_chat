import {check} from 'express-validator/check';
import {tranValidation} from "./../../lang/vi";

let checkMessageLength = [
  check("messageVal", tranValidation.message_text_emoji_incorrect)
    .isLength({min: 1, max: 500})
];

module.exports = {
  checkMessageLength
}