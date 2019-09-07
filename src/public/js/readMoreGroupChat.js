$(document).ready(function() {
  $("#group-chat").find("a#link-read-more-group-chat").unbind("click").on("click", function() {
    let skipGroupChat = $("#group-chat").find("ul.people a").length;
    $("#link-read-more-group-chat").css("display", "none");
    $(".read-more-group-chat-loader").css("display", "inline-block");

    setTimeout(function() {
      $.get(`/message/read-more-group-chat?skipGroupChat=${skipGroupChat}`, function(data) {
        if (data.leftSideData.trim() === "") {
          $("#link-read-more-group-chat").css("display", "inline-block");
          $(".read-more-group-chat-loader").css("display", "none");
          alertify.notify("Không còn nhóm trò chuyện để xem thêm. !", "warning", 6);
          return false
        };

        // step 01: handle left sile
        $("#group-chat").find("ul.people").append(data.leftSideData);

        // step 02: handle scroll left
        resizeNineScrollLeft();
        nineScrollLeft();

        // step 03: handle right side
        $("#screen-chat").append(data.rightSideData);

        // step 04: call function changeScreenChat();
        changeScreenChat()

        // step 05: convert emoji
        convertEmoji();

        // step 06: handle image modal
        $("body").append(data.imageModalData);

        // step 07: call gridPhoto function
        gridPhotos(5);

        // step 0: handle attchment modal
        $("body").append(data.attachmentModalData);

        // step 09 check onlind
        socket.emit("check-online");

        // step 10 remove loading
        $("#link-read-more-group-chat").css("display", "inline-block");
        $(".read-more-group-chat-loader").css("display", "none");

        // step 11 call readmore mesaages
        readMoreMessage();

      })
    }, 300);

  });
});