$(document).ready(function() {
  $("#link-read-more-user-chat").unbind("click").on("click", function() {
    let skipUserChat = $("#user-chat").find("ul.people a").length;
    $("#link-read-more-user-chat").css("display", "none");
    $(".read-more-user-chat-loader").css("display", "inline-block");

    setTimeout(function(){
      $.get(`/message/read-more-user-chat?skipUserChat=${skipUserChat}`, function(data) {
        if (data.leftSideData.trim() === "") {
          alertify.notify("Bạn không còn cuộc trò chuyện nào để xem cả", "error", 7);
          $("#link-read-more-user-chat").css("display", "inline-block");
          $(".read-more-user-chat-loader").css("display", "none");

          return false;
        }

        $("#user-chat").find("ul").append(data.leftSideData);
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
        $("#link-read-more-user-chat").css("display", "inline-block");
        $(".read-more-user-chat-loader").css("display", "none");

        // step 11 call readmore mesaages
        readMoreMessage();
      })
    }, 300);
  });
});
