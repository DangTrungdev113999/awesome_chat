function removeRequestContactSent() {
  $(".user-remove-request-contact-sent")
    .unbind()
    .on("click", function() {
      let targetId = $(this).data("uid");
      $.ajax({
        url: "/contact/remove-request-contact-sent",
        type: "delete",
        data: { uid: targetId },
        success: function(data) {
          if (data.success) {
            $("#find-user")
              .find(`.user-remove-request-contact-sent[data-uid = ${targetId} ]`)
              .hide();
            $("#find-user")
              .find(`.user-add-new-contact[data-uid = ${targetId} ]`)
              .css("display", "inline-block");

            //at navbar
            decreaseNumberNotification("noti_contact_counter", 1);

            // at modal contact
            decreaseNumberNotifContact("count-request-contact-sent");

            // xoa o model tab dang cho xac nhan
            $("#request-contact-sent")
              .find(`li[data-uid = ${targetId}]`)
              .remove();

            socket.emit("remove-request-contact-sent", { contactId: targetId });
          }
        }
      });
    });
}

socket.on("response-remove-request-contact-sent", function(user) {
  $(".noti_content")
    .find(`div[data-uid = ${user.id}]`)
    .remove(); //popup notification
  $("ul.list-notificatins")
    .find(`li>div[data-uid = ${user.id}]`)
    .parent()
    .remove();

  // xoa o model tab yc ket ban
  $("#request-contact-received")
    .find(`li[data-uid = ${user.id}]`)
    .remove();

  //at modal contact
  decreaseNumberNotifContact("count-request-contact-received");

  //at navbar
  decreaseNumberNotification("noti_contact_counter", 1);
  decreaseNumberNotification("noti_counter", 1);
});

$(document).ready(function() {
  removeRequestContactSent();
});
