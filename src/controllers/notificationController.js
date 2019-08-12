import {notification} from "./../services/index"

let readMore = async (req, res) => {
  try {
    // getSkipNumber from query params
    let skipNumberNotification = +(req.query.skipNumber);

    // let more item
    let newNotifications = await notification.readMore(req.user._id, skipNumberNotification);
    return res.status(200).send(newNotifications);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  readMore
}