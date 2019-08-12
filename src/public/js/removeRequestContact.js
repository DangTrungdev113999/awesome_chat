

function removeRequestContact() {
    $(".user-remove-request-contact").bind("click", function() {
      let targetId = $(this).data("uid");
      $.ajax({
        url: "/contact/remove-request-contact",
        type: "delete",
        data: {uid: targetId},
        success: function(data) {
          if (data.success) {
            $("#find-user").find(`.user-remove-request-contact[data-uid = ${targetId} ]`).hide();
            $("#find-user").find(`.user-add-new-contact[data-uid = ${targetId} ]`).css("display", "inline-block");
            decreaseNumberNotifContact("count-request-contact-sent");
            socket.emit("remove-request-contact", {contactId: targetId});
          };
        }
      });
    })
  };

  socket.on("response-remove-request-contact", function(user) {
    console.log(user);
    $(".noti_content").find(`div[data-uid = ${ user.id }]`).remove(); //popup notification
    $("ul.list-notificatins").find(`li>div[data-uid = ${ user.id }]`).parent().remove();

    // xoa o model tab yc ket ban
  
    decreaseNumberNotifContact("count-request-contact-received");
    decreaseNumberNotification("noti_contact_counter");
    decreaseNumberNotification("noti_counter");
  });

