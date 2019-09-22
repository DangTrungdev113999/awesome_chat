
const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function resizeNineScrollLeft() {
  $(".left").getNiceScroll().resize();
};

function nineScrollRight(divId) {
  $(`.right .chat[data-chat=${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat=${divId}]`).scrollTop($(`.right .chat[data-chat=${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        // Gán giá trị vào thẻ input đã bị ẩn
        $(`#write-chat-${divId}`).val(this.getText());
      },
      // Bật lắng nghe DOM cho việc lắng nghe tin nhắn văn bản hặc emoji
      click: function() {
        textAndEmojiChat(divId);
        typingOn(divId);
      },
      blur: function() {
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('.master-loader').css('display', 'none');
}

function spinLoading() {
  $('.master-loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click", function() {
    let href = $(this).attr("href");
    let modalImagesId = href.replace("#", "");

    let originDataImage = $(`#${modalImagesId}`).find("div.modal-body").html();

    let countRows = Math.ceil($(`#${modalImagesId}`).find('div.all-images>img').length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");
    $(`#${modalImagesId}`).find("div.all-images").photosetGrid({
      highresLinks: true,
      rel: "withhearts-gallery",
      gutter: "2px",
      layout: layoutStr,
      onComplete: function() {
        $(`#${modalImagesId}`).find(".all-images").css({
          "visibility": "visible"
        });
        $(`#${modalImagesId}`).find(".all-images a").colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: "90%",
          maxWidth: "90%"
        });
      }
    });

    // bắt sự kiện đóng modal
    $(`#${modalImagesId}`).on('hidden.bs.modal', function () {
      $(this).find("div.modal-body").html(originDataImage);
    })
  });

}


function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  if (notify.length) {
    alertify.notify(notify, 'success', 5);

  }
}

function changeTypeChat() {
  $("#select-type-chat").bind("change", function() {
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");

    if ($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    } else {
      $(".create-group-chat").show();
    };
  })
}

function bufferToBase64(buffer) {
  return  btoa(
    new Uint8Array(buffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
};

function zoomImage() {
  $(".myImg").unbind("click").on("click", function() {
    $("#myModal").css("display", "inline-block");
    $("#img01").attr("src",  $(this).attr("src"));
  })

  // When the user clicks on <span> (x), close the modal
  $(".close-modal").unbind("click").on("click", function() {
    $("#myModal").css("display", "none");
  })
}

function memberOfGroup(groupId) {
  $(".btn-menber-talk").unbind("click").on("click", function() {
    let targetId = $(this).data("uid");
    $(`#menbersOfGroupModal_${groupId}`).modal("hide");
    $("ul.people").find(`a[data-target="#to_${targetId}"]`).click();
  });
}

function changeScreenChat() {
  $(".room-chat").unbind("click").on("click", function() {
    let divId = $(this).find("li").data("chat");
    $(".person").removeClass('active');
    $(`.person[data-chat=${divId}]`).addClass("active");

    $(this).tab("show");

    // config scroll at box findUserByIdchat right side when user click in one conversation
    nineScrollRight(divId);

    // turn on emoji
    enableEmojioneArea(divId);

    // turn on listen DOM to chat image
    imageChat(divId);

    // turn on listen DOM to chat attachment
    attachmentChat(divId);
    
    // turn on listen DOM to chat video
    videoChat(divId);

    zoomImage();

    memberOfGroup(divId);
  })
};

function convertEmoji() {
  $(".convert-emoji").each(function() {
    var original = $(this).html();
    var converted = emojione.toImage(original);
    $(this).html(converted);
  });
};

function checkConversation() {
  if (($("ul.people").find("a").length) === 0) {
    Swal.fire({
      title: `Bạn chưa có chưa có bạn bè nào, hãy kết bạn để tạo thêm liên lạc !`,
      type: "info",
      confirmButtonColor: "#2ECC71",
      confirmButtonText: "xác nhận!",
    }).then( result => {
      if (result.value) {
        $("#contactsModal").modal("show");
      }
    })
  }
};

function configFindConversation() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function chatUser() {
  $(".user-talk").unbind("click").on("click", function() {
    let targetId = $(this).data("uid");
    $("#contactsModal").modal("hide");
    $("ul.people").find(`a[data-target="#to_${targetId}"]`).click();
  });
}


$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();

  // Icon loading khi chạy ajax
  ajaxLoading();


  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);



  // Flash message o man hinh master
  flashMasterNotify();

  // change type chat
  changeTypeChat();

   //change Screen chat
  changeScreenChat();

  // click to the first conversation when f5 web
  if (($("ul.people").find("a").length)) {
      $("ul.people").find("a")[0].click();
  } 


  convertEmoji();

  $("#video-chat-group").bind("click", function() {
    alertify.notify(
      "Chức năng này đang phát triển, vui lòng thẻ với trò chuyện cá nhân. xin cảm ơn.....", 
      "warning",
      6)
  })

  checkConversation();

  chatUser();

});

