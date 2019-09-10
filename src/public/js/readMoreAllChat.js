$(document).ready(function() {
  $("#link-read-more-all-chat").bind("click", function() {
    let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
    let skipGroup = $("#all-chat").find("li.group-chat").length;

    $("#link-read-more-all-chat").css("display", "none");
    $(".read-more-all-chat-loader").css("display", "inline-block");

    setTimeout(() => {
      $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function(data) {
        if (data.leftSideData.trim() === "") {
          alertify.notify("Bạn không còn cuộc trò chuyện nào để xem cả", "error", 7);
          $("#link-read-more-all-chat").css("display", "inline-block");
          $(".read-more-all-chat-loader").css("display", "none");
          return false;
        }

        // step 01: handle left side
        $("#all-chat").find(`ul`).append(data.leftSideData);

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
        $("#link-read-more-all-chat").css("display", "inline-block");
        $(".read-more-all-chat-loader").css("display", "none");

        // step 11 call readmore mesaages
        readMoreMessage();
      });
    }, 300);
    

  });
});