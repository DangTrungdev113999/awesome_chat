function readMoreMessage() {
  $(".right .chat").unbind("scroll").on("scroll",function() {

    // get the fist message
    let firstMessage = $(this).find(".bubble:first");
    // get position of first message
    let currentOffset = firstMessage.offset().top - $(this).scrollTop();

    if ($(this).scrollTop() === 0) {
      let messageLoading = `<img src="images/chat/message-loading.gif" class = "message-loading" />`
      $(this).prepend(messageLoading);

      let targetId = $(this).data("chat");
      let skipMessage = $(this).find("div.bubble").length;
      let chatInGroup = $(this).hasClass("chat-in-group") ? true: false;
      $.get(
        `/message/read-more?targetId=${targetId}&skipMessage=${skipMessage}&chatInGroup=${chatInGroup}`,
        function(data) {
          if (data.rightSideData.trim() === "") {
            alertify.notify("Bạn đã hết tin nhắn.!", "warning", 4)
            $(`.right .chat[data-chat=${targetId}]`).find("img.message-loading").remove();
            return false;
          }
          // step 01 handle right side
          $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);
          // step 02: prevent scoll
          $(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset);

          // step 03: call convert emoji
          convertEmoji();

          // step 04: handle image modal
          $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);

          // step 05: call grid photo
          gridPhotos(5);

          // step 06: handle attachmentModal
          $(`#attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attachmentModalData);

          // step 07: remove message loading
          $(`.right .chat[data-chat=${targetId}]`).find("img.message-loading").remove();
        }
      )

    }
  });
};

$(document).ready(function() {
  readMoreMessage();
})