function textAndEmojiChat(divId) {
  $(".emojionearea")
    .unbind("keyup")
    .on("keyup", function(element) {
      let currentEmojioneArea = $(this);
      if (element.which === 13) {
        let targetId = $(`#write-chat-${divId}`).data("chat");
        let messageVal = $(`#write-chat-${divId}`).val();

        if (!targetId.length || !messageVal.length) {
          return false;
        }

        let dataTextEmojiSend = {
          uid: targetId,
          messageVal
        };

        if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
          dataTextEmojiSend.isChatGroup = true;
        }

        // call send message to server
        $.post("/message/add-new-text-emoji", dataTextEmojiSend, function(data) {
          let dataToEmit = {
            message: data.message
          };
          // step 1 : handle  message data before show
          let messageOfMe = $(
            `<div class="convert-emoji bubble me" data-mess-id="${data.message._id}"></div>`
          );
          messageOfMe.text(data.message.text);
          let convertEmojiMessage = emojione.toImage(messageOfMe.html());

          if (dataTextEmojiSend.isChatGroup) {
            let senderAvatar = 
              ` <img src="/images/users/${data.message.sender.avatar}" class="avatar-small" 
              title="${data.message.sender.name}"/>`;
            messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);
            
            increateNumberMessageGroup(divId);
            dataToEmit.groupId = targetId;
          } else {
            messageOfMe.html(convertEmojiMessage);
            dataToEmit.contactId = targetId;
          }

          
          // step 2: append message to screen
          $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
          nineScrollRight(divId); // push Scroll to down

          // step 3: remove data at input
          $(`#write-chat-${divId}`).val("");
          currentEmojioneArea.find(".emojionearea-editor").text("");

          // step 4: change data preview and time to left side
          $(`.person[data-chat=${divId}]`)
            .find("span.time")
            .removeClass("message-time-realtime")
            .html(
              moment(data.message.createdAt)
                .locale("vi")
                .startOf("seconds")
                .fromNow()
            );
          $(`.person[data-chat=${divId}]`)
            .find("span.preview")
            .html(emojione.toImage(data.message.text));

          // step 5: move conversation to the top
          $(`.person[data-chat=${divId}]`).on("dangtrungdev.moveConversationToTheTop", function() {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("dangtrungdev.moveConversationToTheTop");
          });
          $(`.person[data-chat=${divId}]`).trigger("dangtrungdev.moveConversationToTheTop");

          // step 6: emit
          socket.emit("chat-text-emoji", dataToEmit);

          //step 7: emit remove typing real-time
          typingOff(divId);

          //step 8: if this has typing, remove that immedicate
          let checkTyping =  $(`.chat[data-chat=${divId}]`).find(`div.bubble-typing-gif`);
          if (checkTyping.length) {
            checkTyping.remove();
          };

        }).fail(function(response) {
          alertify.notify(response.responseText, "error", 6);
        });
      }
    });
};

$(document).ready(function() {

  socket.on("response-chat-text-emoji", function(response) {
    let divId = "";
    // step 1 : handle  message data before show
    let messageOfYou = $(
      `<div class="convert-emoji bubble you" data-mess-id="${response.message._id}"></div>`
    );
    messageOfYou.text(response.message.text);
    let convertEmojiMessage = emojione.toImage(messageOfYou.html());

    if (response.currentGroupId) {
      let senderAvatar = 
        ` <img src="/images/users/${response.message.sender.avatar}" class="avatar-small" 
        title="${response.message.sender.name}"/>`;
      messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);

      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increateNumberMessageGroup(divId);
      }

    } else {
      messageOfYou.html(convertEmojiMessage);
      divId = response.currentUserId
    }

    // step 2: append message to screen
    // there is an if becaise all user have common group
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      nineScrollRight(divId); // push Scroll to down
      // increateNumberMessageGroup(divId);
      $(`.person[data-chat=${divId}]`)
      .find("span.time")
      .addClass("message-time-realtime")
    }

    // step 3: change data preview and time to left side
    $(`.person[data-chat=${divId}]`)
    .find("span.time")
    .html(
      moment(response.message.createdAt)
        .locale("vi")
        .startOf("seconds")
        .fromNow()
    );
    $(`.person[data-chat=${divId}]`)
      .find("span.preview")
      .html(emojione.toImage(response.message.text));

    // step 4: move conversation to the top
    $(`.person[data-chat=${divId}]`).on("dangtrungdev.moveConversationToTheTop", function() {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("dangtrungdev.moveConversationToTheTop");
    });
    $(`.person[data-chat=${divId}]`).trigger("dangtrungdev.moveConversationToTheTop");

  });

});