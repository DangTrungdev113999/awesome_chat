
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
<<<<<<< HEAD
};
=======
};
>>>>>>> d5501ac424f36c1abb9be6a7b4389c9eae746b6d
