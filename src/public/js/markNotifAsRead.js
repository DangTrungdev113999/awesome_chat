function markNotificationAsRead(targetUsers) {
  $.ajax({
    url: "/notification/mark-all-as-read",
    type: "put",
    data: { targetUsers },
    success: result => {
      if (result) {
        targetUsers.forEach(uid => {
          $(".noti_content")
            .find(`div[data-uid=${uid}]`)
            .removeClass("notif-readed-faild");
          $("ul.list-notificatins")
            .find(`li>div[data-uid=${uid}]`)
            .removeClass("notif-readed-faild");
        });

        decreaseNumberNotification("noti_counter", targetUsers.length);
      }
    }
  });
}

$(document).ready(function() {
  $("#popup-mark-notif-as-read").bind("click", function() {
    let targetUsers = [];
    $(".noti_content")
      .find("div.notif-readed-faild")
      .each(function(index, notification) {
        targetUsers.push($(notification).data("uid"));
      });

    if (!targetUsers.length) {
      alertify.notify("Bạn không còn thông báo nào chưa đọc", "error", 6);
      return false;
    }

    markNotificationAsRead(targetUsers);
  });

  $("#model-mark-notif-as-read").bind("click", function() {
    let targetUsers = [];
    $("ul.list-notificatins")
      .find("li>div.notif-readed-faild")
      .each(function(index, notification) {
        targetUsers.push($(notification).data("uid"));
      });

    if (!targetUsers.length) {
      alertify.notify("Bạn không còn thông báo nào chưa đọc", "error", 6);
      return false;
    }

    markNotificationAsRead(targetUsers);
  });
});
