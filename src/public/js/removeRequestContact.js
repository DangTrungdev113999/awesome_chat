

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
          };
        }
      });
    })
  };
<<<<<<< HEAD
  
=======
>>>>>>> d5501ac424f36c1abb9be6a7b4389c9eae746b6d
