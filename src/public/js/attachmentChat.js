function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`).unbind("change").on("change", function() {
    let fileData = $(this).prop("files")[0];
    let limit = 1048576;

    if (fileData.size > limit) {
      alertify.notify("tệp tin đính kèm tối đa cho phép 1MB", "error", 6);
      $(this).val(null);
      return false;
    }

    let targetId = $(this).data("chat");
    let isChatGroup = false;

    let messageFormData = new FormData();
    messageFormData.append("my-attachment-chat", fileData);
    messageFormData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageFormData.append("isChatGroup", true);
      isChatGroup = true;
    }

    $.ajax({
      url: "/message/add-new-attachment",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function(data) {
        console.log(data);
        let dataToEmit = {
          message: data.message
        };

        // step 1 : handle message data before show
        let messageOfMe = $(
          `<div class="convert-emoji bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`
        );

        let attachmentChat = `
          <a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)} %>"
          download=" ${data.message.file.fileName}">
            ${data.message.file.fileName}
          </a>
          `;
        
        if (isChatGroup) {
          let senderAvatar = 
            ` <img src="/images/users/${data.message.sender.avatar}" class="avatar-small" 
            title="${data.message.sender.name}"/>`;
          messageOfMe.html(`${senderAvatar} ${attachmentChat}`);
          
          increateNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(attachmentChat);
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
          .html("tệp đính kèm ... ");

        // step 5: move conversation to the top
        $(`.person[data-chat=${divId}]`).on("dangtrungdev.moveConversationToTheTop", function() {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("dangtrungdev.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("dangtrungdev.moveConversationToTheTop");

        // step 6: emit
        socket.emit("chat-attachment", dataToEmit);

        //step 7: emit remove typing real-time  nothing to code :|
        //step 8: if this has typing, remove that immedicate  nothing to code :|

        // step 9: add to model iamge

        let attachmentChatToModal = `
        <li>
          <a href="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}"
              download="${data.message.file.fileName}">
              ${data.message.file.fileName}
          </a>
        </li>
        `;

        $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToModal);


      },
      error: function(error) {
        alertify.notify(error.responseText, "error", 6);
      }
    });

  })
};

$(document).ready(function() {
  socket.on("response-chat-attachment", function(response) {
    let divId = "";
    // step 1 : handle  message data before show
    let messageOfYou = $(
      `<div class="convert-emoji bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`
    );

    let attachmentChat = `
    <a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)} %>"
      download=" ${response.message.file.fileName}">
      ${response.message.file.fileName}
    </a>
    `;

    if (response.currentGroupId) {
      let senderAvatar = 
        ` <img src="/images/users/${response.message.sender.avatar}" class="avatar-small" 
        title="${response.message.sender.name}"/>`;
      messageOfYou.html(`${senderAvatar} ${attachmentChat}`);

      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increateNumberMessageGroup(divId);
      }

    } else {
      messageOfYou.html(attachmentChat);
      divId = response.currentUserId
    }

    // step 2: append message to screen
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {// there is an if becaise all user have common group
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
      .html("tệp đính kèm ... ");

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
      let attachmentChatToModal = `
      <li>
        <a href="data:${response.message.file.contentType}; base64,${bufferToBase64(response.message.file.data.data)}"
            download="${response.message.file.fileName}">
            ${response.message.file.fileName}
        </a>
      </li>
      `;
      $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToModal);
    }
  })
})