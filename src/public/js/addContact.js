function addContact() {
  // addcontact function will inside when called ajax
  $(".user-add-new-contact").bind("click", function() {
    let targetId = $(this).data("uid");
    $.post("/contact/add-new", { uid: targetId }, function(data) {
      if (data.success) {
        $("#find-user")
          .find(`.user-add-new-contact[data-uid = ${targetId} ]`)
          .hide();
        $("#find-user")
          .find(`.user-remove-request-contact-sent[data-uid = ${targetId} ]`)
          .css("display", "inline-block");

        increaseNumberNotification("noti_contact_counter", 1);

        increaseNumberNotifContact("count-request-contact-sent");

        // them o modal tap dang cho xac nhan
        let userInfoHtml = $("#find-user")
          .find(`ul li[data-uid = ${targetId}]`)
          .get(0).outerHTML;
        $("#request-contact-sent")
          .find("ul")
          .prepend(userInfoHtml);

        removeRequestContactSent();

        socket.emit("add-new-contact", { contactId: targetId });
      }
    });
  });
}

socket.on("response-add-new-contact", function(user) {
  let notif = `
    <div class="notif-readed-faild" data-uid="${user.id}">
      <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
      <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
    </div>
  `;
  $(".noti_content").prepend(notif);
  $("ul.list-notificatins").prepend(`<li>${notif}</li>`);

  increaseNumberNotifContact("count-request-contact-received");

  increaseNumberNotification("noti_contact_counter", 1);
  increaseNumberNotification("noti_counter", 1);

  // them o modal tap y/c ket ban
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
                <span>&nbsp  ${user.address}</span>
            </div>
            <div class="user-approve-request-contact-received" data-uid="${user.id}">
                Chấp nhận
            </div>
            <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
                Xóa yêu cầu
            </div>
        </div>
      </li>`;
  $("#request-contact-received")
    .find("ul")
    .prepend(userInfoHTML);

  removeRequestContactReceived();
  approveRequestContactReceived();
});
