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

    let messageFormdata = new FormData();
    messageFormdata.append("my-image-chat", fileData);
    messageFormdata.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageFormdata.append("isChatGroup", true);
    }

    $.ajax({
      url: "/message/add-new-image",
      type: "post",
      cache: false, // just use for upload file
      contentType: false, // just use for upload file
      processData: false, // just use for upload file
      data: messageFormdata,
      success: function(data) {
        console.log(data);
      },
      error: function(error) {
        alertify.notify(error.responseText, "error", 6);
      }
    });

  });
};