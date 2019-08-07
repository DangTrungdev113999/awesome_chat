let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;

function updateUserInfo() {
  $('#input-change-avatar').bind('change', function() {
    let fileData = $(this).prop("files")[0];
    let math = ['image/png', 'image/jpg', 'image/jpeg'];
    let limit = 1048576; // 1MB

    if ($.isArray(fileData.type, math) === -1) {
      alertify.notify("Kiểu file không hợp lệ chỉ chấp nhận jpg & png", 'error', 6);
      return false;
    };

    if (fileData.size > limit) {
      alertify.notify("Ảnh vượt quá dung lượng 1MB", 'error', 6);
      return false;
    };

    if (typeof (FileReader) !== 'undefined') {
      let imagePreview = $('#image-edit-profile');
      imagePreview.empty();

      let fileReader = new FileReader();
      fileReader.onload = function(element) {
        $('<img>', {
          'src': element.target.result,
          'class': 'avatar img-circle',
          'id': 'user-modal-avatar',
          'alt': 'avatar'
        }).appendTo(imagePreview);
      };

      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FromData();
      formData.appendTo('avatar', fileData);

      userAvatar = formData;

    } else {
      alertify.notify('Trình duyệt của bạn không hỗ trợ FileReader.', 'error', 6);
    };

  });

  $('#input-change-username').bind('change', function() {
    userInfo.username = $(this).val();
  });

  $('#input-change-gender-male').bind('click', function() {
    userInfo.gender = $(this).val();
  });

  $('#input-change-gender-female').bind('click', function() {
    userInfo.gender = $(this).val();
  });

  $('#input-change-address').bind('change', function() {
    userInfo.address = $(this).val();
  });

  $('#input-change-phone').bind('change', function() {
    userInfo.phone = $(this).val();
  });
};

$(document).ready(function() {
  updateUserInfo();

  originAvatarSrc = $('#user-modal-avatar').attr('src');

  $('#input-btn-update-user').bind('click', function() {
    if($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify('mai sua', 'error', 6);
      return false;
    };

    $.ajax({
      url: '/user/update-avatar',
      type: 'put',
      cache: false,
      contenType: false,
      processData: false,
      data: userAvatar,
      success: function(result) {
        //
      },
      error: function(error) {
        //
      }

    })

  });
  $('#input-btn-cancel-update-user').bind('click', function() {
    userAvatar = null;
    userInfo = {};
    $('#user-modal-avatar').attr('src', originAvatarSrc);
  });

});