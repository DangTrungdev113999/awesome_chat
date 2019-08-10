
function addContact() {  // addcontact function will inside when called ajax
  $(".user-add-new-contact").bind("click", function() {
    let targetId = $(this).data("uid");
    $.post('/contact/add-new', {uid: targetId}, function(data) {
      if (data.success) {
        $("#find-user").find(`.user-add-new-contact[data-uid = ${targetId} ]`).hide();
        $("#find-user").find(`.user-remove-request-contact[data-uid = ${targetId} ]`).css("display", "inline-block");

        increaseNumberNotifContact("count-request-contact-sent");

      };
    });
  })
};

