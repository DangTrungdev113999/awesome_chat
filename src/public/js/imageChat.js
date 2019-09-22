function imageChat(divId) {
  $(`#image-chat-${divId}`).unbind("change").on("change", function() {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; // 1MB

    if ($.isArray(fileData.type, math) === -1) {
      alertify.notify(
        "Kiểu file không hợp lệ chỉ chấp nhận jpg & png",
        "error",
        6
      );
      return false;
    }

    if (fileData.size > limit) {
      alertify.notify("Ảnh vượt quá dung lượng 1MB", "error", 6);
      return false;
    }

    let targetId = $(this).data("chat");
    let isChatGroup = false;

    let messageFormdata = new FormData();
    messageFormdata.append("my-image-chat", fileData);
    messageFormdata.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageFormdata.append("isChatGroup", true);
      isChatGroup = true
    }

    $.ajax({
      url: "/message/add-new-image",
      type: "post",
      cache: false, // just use for upload file
      contentType: false, // just use for upload file
      processData: false, // just use for upload file
      data: messageFormdata,
      success: function(data) {
        let dataToEmit = {
          message: data.message
        };

        // step 1 : handle  message data before show
        let messageOfMe = $(
          `<div class="convert-emoji bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`
        );

        let imageChat = `
            <img src="data: ${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat myImg">
        `;

        if (isChatGroup) {
          let senderAvatar = 
            ` <img src="/images/users/${data.message.sender.avatar}" class="avatar-small" 
            title="${data.message.sender.name}"/>`;
          messageOfMe.html(`${senderAvatar} ${imageChat}`);
          
          increateNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(imageChat);
          dataToEmit.contactId = targetId;
        }

        // step 2: append message to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId); // push Scroll to down

        // step 3: remove data at input : nothing to code :|

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
          .html("hình ảnh ...");

        // step 5: move conversation to the top
        $(`.person[data-chat=${divId}]`).on("dangtrungdev.moveConversationToTheTop", function() {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("dangtrungdev.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("dangtrungdev.moveConversationToTheTop");

        // step 6: emit
        socket.emit("chat-image", dataToEmit);

        //step 7: emit remove typing real-time  nothing to code :|
        //step 8: if this has typing, remove that immedicate  nothing to code :|

        // step 9: add to model iamge
        let imageChatToModal = `
          <img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}">
        `;

        $(`#imagesModal_${divId}`).find(".all-images").append(imageChatToModal);

        zoomImage();
      },
      error: function(error) {
        alertify.notify(error.responseText, "error", 6);
      }
    });

  });
};

$(document).ready(function() {
  socket.on("response-chat-image", function(response) {
    let divId = "";
    // step 1 : handle  message data before show
    let messageOfYou = $(
      `<div class="convert-emoji bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`
    );

    let imageChat = `
      <img src="data: ${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" class="show-image-chat myImg">
    `;


    if (response.currentGroupId) {
      let senderAvatar = 
        ` <img src="/images/users/${response.message.sender.avatar}" class="avatar-small" 
        title="${response.message.sender.name}"/>`;
      messageOfYou.html(`${senderAvatar} ${imageChat}`);

      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increateNumberMessageGroup(divId);
      }

    } else {
      messageOfYou.html(imageChat);
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

    // step 3: remove all data in input nothing to code

    // step 4: change data preview and time to left side
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
      .html("hình ảnh....");

    // step 5: move conversation to the top
    $(`.person[data-chat=${divId}]`).on("dangtrungdev.moveConversationToTheTop", function() {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("dangtrungdev.moveConversationToTheTop");
    });
    $(`.person[data-chat=${divId}]`).trigger("dangtrungdev.moveConversationToTheTop");

    // step 6: emit
    //step 7: emit remove typing real-time  nothing to code :|
    //step 8: if this has typing, remove that immedicate  nothing to code :|

    // step 9: add to model 
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let imageChatToModal = `
        <img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}">
      `;

      $(`#imagesModal_${divId}`).find(".all-images").append(imageChatToModal);
    }

    zoomImage();

  })
});