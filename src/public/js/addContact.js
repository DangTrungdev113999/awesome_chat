
function addContact() {  // addcontact function will inside when called ajax
  $(".user-add-new-contact").bind("click", function() {
    let targetId = $(this).data("uid");
    $.post('/contact/add-new', {uid: targetId}, function(data) {
      if (data.success) {
        $("#find-user").find(`.user-add-new-contact[data-uid = ${targetId} ]`).hide();
        $("#find-user").find(`.user-remove-request-contact[data-uid = ${targetId} ]`).css("display", "inline-block");
        increaseNumberNotifContact("count-request-contact-sent");

        socket.emit("add-new-contact", {contactId: targetId});

      };
    });
  })
};

socket.on("response-add-new-contact", function(user) {
  let notif = `<span class="notif-readed-faild" data-uid="${ user.id }">
                <img class="avatar-small" src="images/users/${ user.avatar }" alt=""> 
                <strong>${ user.username }</strong> đã gửi cho bạn một lời mời kết bạn!
              </span><br><br><br>`;
  $(".noti_content").prepend(notif);

  increaseNumberNotifContact("count-request-contact-received");
  increaseNumberNotification("noti_contact_counter");
  increaseNumberNotification("noti_counter");
});
