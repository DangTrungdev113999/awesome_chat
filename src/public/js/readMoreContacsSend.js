$(document).ready(function() {
  $("#link-read-more-contacts-send").bind("click", function() {
    let skipNumber = $("#request-contact-sent").find("li").length;

    $("#link-read-more-contacts-send").css("display", "none");
    $(".read-more-contacts-send-loader").css("display", "inline-block");

    setTimeout(() => {
      $.get(
        `/contact/read-more-contacts-send?skipNumber=${skipNumber}`,
        function(newContactUsersSend) {
          if (!newContactUsersSend.length) {
            alertify.notify(
              "Bạn không còn bạn bè nào để xem thêm. !",
              "error",
              6
            );
            $("#link-read-more-contacts-send").css("display", "inline-block");
            $(".read-more-contacts-send-loader").css("display", "none");
            return false;
          }

          newContactUsersSend.forEach(user => {
            $("#request-contact-sent").find("ul").append(`
                  <li class="_contactList" data-uid="${user._id}">
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
                            <span>&nbsp ${
                              user.address ? user.address : ""
                            }</span>
                        </div>
                        <div class="user-remove-request-contact-sent action-danger display-important" data-uid="${
                          user._id
                        }">
                            Hủy yêu cầu
                        </div>
                    </div>
                  </li>     `);
          });
          removeRequestContactSent();
          $("#link-read-more-contacts-send").css("display", "inline-block");
          $(".read-more-contacts-send-loader").css("display", "none");
        }
      );
    }, 300);
  });
});
