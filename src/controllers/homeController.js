import {notification} from './../services/index'

let getHome =  async (req, res) => {
  //only 10 item one time
  let notifications = await notification.getNotifications(req.user._id);

  //get amout notification unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  return res.render('main/home/home', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    user: req.user,
    notifications,
    countNotifUnread
  });
};

module.exports = {
  getHome
}