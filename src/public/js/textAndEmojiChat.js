

function textAndEmojiChat(divId) {
  $(".emojionearea")
    .unbind("keyup")
    .on("keyup", function(element) {
      if (element.which === 13) {
        let targetId = $(`#write-chat-${divId}`).data("chat");
        let messageVal = $(`#write-chat-${divId}`).val();

        // if (!targetId.length || !messageVal.length) {
        //   return false;
        // }

        let dataTextEmojiSend = {
          uid: targetId,
          messageVal
        };

        if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
          dataTextEmojiSend.isChatGroup = true;
        }

        // call send message to server
        $.post("/message/add-new-text-emoji", dataTextEmojiSend, function(data) {
          console.log(data.message);
        }).fail(function(response) {
          alertify.notify(response.responseText, "error", 6);
        });
      }
    });
}
