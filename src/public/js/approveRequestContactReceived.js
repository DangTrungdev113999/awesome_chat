function approveRequestContactReceived() {
  $(".user-approve-request-contact-received").unbind().on("click", function() {
    let targetId = $(this).data("uid");

    $.ajax({
      url: "/contact/approve-request-contact-received",
      type: "put",
      data: {uid: targetId},
      success: function(data) {
        if (data.success) {
          let userInfo = $("#request-contact-received").find(`ul li[data-uid=${targetId}]`);
          $(userInfo).find("div.user-approve-request-contact-received").remove();
          $(userInfo).find("div.user-remove-request-contact-received").remove();
          $(userInfo).find("div.contactPanel")
            .append(`
              <div class="user-talk" data-uid="${targetId}">
                  Trò chuyện
              </div>
              <div class="user-remove-contact action-danger" data-uid="${targetId}">
                  Xóa liên hệ
              </div>
            `);
      
          let userInfoHTML = userInfo.get(0).outerHTML;
          $("#contacts").find("ul").prepend(userInfoHTML);
          $(userInfo).remove();
          decreaseNumberNotifContact("count-request-contact-received");
          increaseNumberNotifContact("count-contacts");
          decreaseNumberNotification("noti_contact_counter", 1);

          socket.emit("approve-request-contact-received", {contactId: targetId});
        };
      }
    });
  });
};

socket.on("response-approve-request-contact-received", function(user) {
  let notif = `<div class="notif-readed-faild" data-uid="${ user.id }">
                <img class="avatar-small" src="images/users/${ user.avatar }" alt=""> 
                <strong>${ user.username }</strong> đã chấp nhận lời mời kết bạn của bạn!
              </div>`;
  $(".noti_content").prepend(notif); // popup notificatin
  $("ul.list-notificatins").prepend(`<li>${notif}</li>`); //modal notification

  increaseNumberNotification("noti_counter", 1);
  decreaseNumberNotification("noti_contact_counter", 1);

  decreaseNumberNotifContact("count-request-contact-sent");
  increaseNumberNotifContact("count-contacts");

  $("#request-contact-sent").find(`ul li[data-uid=${user.id}]`).remove();
  $("#find-user").find(`ul li[data-uid=${user.id}]`).remove();
  let userInfoHTML = `
    <li class="_contactList" data-uid="${user.id}">
      <div class="contactPanel">
          <div class="user-avatar">
              <img src="images/users/${user.avatar}" alt="">
          </div>
          <div class="user-name">
              <p>
                  ${user.username}
              </p>
          </div>
          <br>
          <div class="user-address">
              <span>&nbsp ${user.address}</span>
          </div>
          <div class="user-talk" data-uid="${user.id}">
              Trò chuyện
          </div>
          <div class="user-remove-contact action-danger" data-uid="${user.id}">
              Xóa liên hệ
          </div>
      </div>
    </li>
  `;
  $("#contacts").find("ul").prepend(userInfoHTML);


});

$(document).ready(function() {
  approveRequestContactReceived();
});