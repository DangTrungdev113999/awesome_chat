$(document).ready(function() {
  $("#link-read-more-notif").bind("click", function() {
    let skipNumber = $("ul.list-notificatins").find("li").length;

    $("#link-read-more-notif").css("display", "none");
    $(".read-more-notif-loader").css("display", "inline-block");

    setTimeout(() => {
      $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(
        notificatins
      ) {
        if (!notificatins.length) {
          alertify.notify(
            "Bạn không còn thông báo nào để xem thêm.!",
            "error",
            6
          );
          $("#link-read-more-notif").css("display", "inline-block");
          $(".read-more-notif-loader").css("display", "none");
          return false;
        }

        notificatins.forEach(notification => {
          $("ul.list-notificatins").append(`<li>${notification}</li>`);
        });

        $("#link-read-more-notif").css("display", "inline-block");
        $(".read-more-notif-loader").css("display", "none");
      });
    }, 300);
  });
});
