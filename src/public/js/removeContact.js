function removeContact() {
  $(".user-remove-contact")
    .unbind("click")
    .on("click", function() {
      let targetId = $(this).data("uid");
      let username = $(this)
        .parent()
        .find("div.user-name p")
        .text();

      Swal.fire({
        title: `Bạn có chắc chắn muốn xóa ${username} khỏi danh bạ?`,
        text: "Bạn không thể hoàn tác lại quá trình này.!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2ECC71",
        cancelButtonColor: "#ff7675",
        confirmButtonText: "xác nhận!",
        cancelButtonText: "Hủy."
      }).then(result => {
        if (!result.value) {
          return false;
        }
        $.ajax({
          url: "/contact/remove-contact",
          type: "delete",
          data: { uid: targetId },
          success: function() {
            $("#contacts")
              .find(`ul li[data-uid=${targetId}]`)
              .remove();
            decreaseNumberNotifContact("count-contacts");
            socket.emit("remove-contact", { contactId: targetId });

            // all step handle chat after remove contact
            // step 0: check active
            let checkActive = $("#all-chat").find(`li[data-chat = ${targetId}]`).hasClass("active");
            // step 01: remove leftside.ejs
            $("#all-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();
            $("#user-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();

             // step 02: remove rightside.ejs
            $("#screen-chat").find(`div#to_${targetId}`).remove();

            // step 03: remove imageModal
            $("body").find(`div#imageModal_${targetId}`).remove();

            // step 04: remove attachmentModal
            $("body").find(`div#attachment_${targetId}`).remove();

            // step 05: click first conversation
            if (checkActive) {
              $("ul.people").find("a")[0].click();
            }
          }
        });
      });
    });
}

socket.on("response-remove-contact", function(user) {
  $("#contacts")
    .find(`ul li[data-uid=${user.id}]`)
    .remove();
  decreaseNumberNotifContact("count-contacts");
    // all step handle chat after remove contact
  // step 0: check active
  let checkActive = $("#all-chat").find(`li[data-chat = ${user.id}]`).hasClass("active");

  // step 01: remove leftside.ejs
  $("#all-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();
  $("#user-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();

    // step 02: remove rightside.ejs
  $("#screen-chat").find(`div#to_${user.id}`).remove();

  // step 03: remove imageModal
  $("body").find(`div#imageModal_${user.id}`).remove();

  // step 04: remove attachmentModal
  $("body").find(`div#attachment_${user.id}`).remove();
  
  // step 05: click first conversation
  if (checkActive) {
    $("ul.people").find("a")[0].click();
  }
});

$(document).ready(function() {
  removeContact();
});
