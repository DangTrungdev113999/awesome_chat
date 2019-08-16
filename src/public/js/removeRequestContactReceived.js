function removeRequestContactReceived() {
  $(".user-remove-request-contact-received")
    .unbind()
    .on("click", function() {
      let targetId = $(this).data("uid");
      $.ajax({
        url: "/contact/remove-request-contact-received",
        type: "delete",
        data: { uid: targetId },
        success: function(data) {
          if (data.success) {
            $("#request-contact-received")
              .find(`li[data-uid=${targetId}]`)
              .remove();

            decreaseNumberNotifContact("count-request-contact-received");
            decreaseNumberNotification("noti_contact_counter", 1);

            socket.emit("remove-request-contact-received", {
              contactId: targetId
            });
          }
        }
      });
    });
}

socket.on("response-remove-request-contact-received", function(user) {
  $("#find-user")
    .find(`.user-add-new-contact[data-uid=${user.id}]`)
    .css("display", "inline-block");
  $("#find-user")
    .find(`.user-remove-request-contact-sent[data-uid=${user.id}]`)
    .hide();

  $("#request-contact-sent")
    .find(`li[data-uid=${user.id}]`)
    .remove();
  decreaseNumberNotifContact("count-request-contact-sent");
  decreaseNumberNotification("noti_contact_counter", 1);
});

$(document).ready(function() {
  removeRequestContactReceived();
});
