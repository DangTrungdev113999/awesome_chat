let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function callLogout() {
  let timerInterval;
  Swal.fire({
    position: "top-end",
    title: "Tự động đăng xuất sau 5s.",
    html: "Thoi gian: <strong></strong>",
    timer: 5000,
    onBeforeOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        Swal.getContent().querySelector("strong").textContent = Math.ceil(
          Swal.getTimerLeft() / 1000
        );
      }, 1000);
    },
    onClose: () => {
      clearInterval(timerInterval);
    }
  }).then(result => {
    $.get("/logout", function() {
      location.reload();
    });
  });
}

// get data when user use event
function updateUserInfo() {
  $("#input-change-avatar").bind("change", function() {
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

    if (typeof FileReader !== "undefined") {
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty();

      let fileReader = new FileReader();
      fileReader.onload = function(element) {
        $("<img>", {
          src: element.target.result,
          class: "avatar img-circle",
          id: "user-modal-avatar",
          alt: "avatar"
        }).appendTo(imagePreview);
      };

      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formdata = new FormData();
      formdata.append("avatar", fileData);

      userAvatar = formdata;
    } else {
      alertify.notify(
        "Trình duyệt của bạn không hỗ trợ FileReader.",
        "error",
        6
      );
    }
  });

  $("#input-change-username").bind("change", function() {
    let username = $(this).val();
    let regexUsername = new RegExp(
      /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    );
    if (
      !regexUsername.test(username) ||
      username.length < 3 ||
      username.length > 17
    ) {
      alertify.notify(
        "'Tên chỉ được phép giới hạn đến 3-17 kí tự, không được phép chứa kí tự đặc biệt !'",
        "error",
        6
      );
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;
    }
    userInfo.username = username;
  });

  $("#input-change-gender-male").bind("click", function() {
    let gender = $(this).val();
    if (gender !== "male") {
      alertify.notify("OMG…! Bạn đang muốn hack à.", "error", 6);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    userInfo.gender = gender;
  });

  $("#input-change-gender-female").bind("click", function() {
    let gender = $(this).val();
    if (gender !== "female") {
      alertify.notify("OMG…! Bạn đang muốn hack à.", "error", 6);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    userInfo.gender = gender;
  });

  $("#input-change-address").bind("change", function() {
    let address = $(this).val();
    if (address.length > 30 || address.length < 3) {
      alertify.notify("Đia chỉ giới hạn từ  3 – 30 kí tự.!", "error", 6);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    }
    userInfo.address = address;
  });

  $("#input-change-phone").bind("change", function() {
    let phone = $(this).val();
    let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);
    if (!regexPhone.test(phone)) {
      alertify.notify(
        "Số điện thoại bắt đầu bằng 0 và kết thúc, giới hạn từ 10 đén 11 số.!",
        "error",
        6
      );
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }
    userInfo.phone = phone;
  });

  $("#input-change-current-password").bind("change", function() {
    let currentPassword = $(this).val();
    let regexPassword = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
    );
    if (!regexPassword.test(currentPassword)) {
      alertify.notify(
        "mật khẩu phải bao gồm 8 kí tự, chữ hoa, chữ thường, số và kí tự đặc biệt!",
        "error",
        6
      );
      $(this).val(null);
      delete userUpdatePassword.currentPassword;
      return false;
    }

    userUpdatePassword.currentPassword = currentPassword;
  });

  $("#input-change-new-password").bind("change", function() {
    let newPassword = $(this).val();
    let regexPassword = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
    );
    if (!regexPassword.test(newPassword)) {
      alertify.notify(
        "mật khẩu phải bao gồm 8 kí tự, chữ hoa, chữ thường, số và kí tự đặc biệt!",
        "error",
        6
      );
      $(this).val(null);
      delete userUpdatePassword.newPassword;
      return false;
    }

    userUpdatePassword.newPassword = newPassword;
  });

  $("#input-change-confirm-new-password").bind("change", function() {
    let confirmNewPassword = $(this).val();

    if (!userUpdatePassword.newPassword) {
      alertify.notify("Bạn phải nhập lại mật khẩu mới", "error", 6);
      $(this).val(null);
      return false;
    }

    if (confirmNewPassword !== userUpdatePassword.newPassword) {
      alertify.notify("Mật khẩu mới nhập lại không khớp", "error", 6);
      $(this).val(null);
      return false;
    }

    userUpdatePassword.confirmNewPassword = confirmNewPassword;
  });
}

function callUpdateUserAvatar() {
  $.ajax({
    url: "/user/update-avatar",
    type: "put",
    cache: false, // just use for upload file
    contentType: false, // just use for upload file
    processData: false, // just use for upload file
    data: userAvatar,
    success: function(result) {
      //display success
      $(".user-modal-alert-success")
        .find("span")
        .text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      // update avatar at navbar
      $("#navbar-avatar").attr("src", result.imageSrc);

      // update avatar source
      originAvatarSrc = result.imageSrc;

      //reset all
      $("#input-btn-cancel-update-user").click();
    },
    error: function(error) {
      // display error
      $(".user-modal-alert-error")
        .find("span")
        .text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");

      //reset image from default
      $("#input-btn-cancel-update-user").click();
    }
  });
}

function callUpdateUserInfo() {
  $.ajax({
    url: "/user/update-info",
    type: "put",
    data: userInfo,
    success: function(result) {
      //display success
      $(".user-modal-alert-success")
        .find("span")
        .text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      // update origin user info
      originUserInfo = Object.assign(originUserInfo, userInfo);

      // update user info
      $("#navbar-username").text(originUserInfo.username);

      //reset all
      $("#input-btn-cancel-update-user").click();
    },
    error: function(error) {
      // display error
      $(".user-modal-alert-error")
        .find("span")
        .text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");

      //reset image from default
      $("#input-btn-cancel-update-user").click();
    }
  });
}

function callUpdateUserPassword() {
  $.ajax({
    url: "/user/update-password",
    type: "put",
    data: userUpdatePassword,
    success: function(result) {
      $(".user-modal-alert-password-success")
        .find("span")
        .text(result.message);
      $(".user-modal-alert-password-success").css("display", "block");
      $("#input-btn-cancel-update-user-password").click();

      //logout after change password
      callLogout();
    },
    error: function(error) {
      $(".user-modal-alert-password-error")
        .find("span")
        .text(error.responseText);
      $(".user-modal-alert-password-error").css("display", "block");

      $("#input-btn-cancel-update-user-password").click();
    }
  });
}

$(document).ready(function() {
  originAvatarSrc = $("#user-modal-avatar").attr("src");
  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: $("#input-change-gender-male").is(":checked")
      ? $("#input-change-gender-male").val()
      : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val()
  };

  // update user info after change to update
  updateUserInfo();

  $("#input-btn-update-user").bind("click", function() {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("vui lòng điền thông tin trước khi apdate", "error", 6);
      return false;
    }

    if (userAvatar) {
      callUpdateUserAvatar();
    }

    if (!$.isEmptyObject(userInfo)) {
      callUpdateUserInfo();
    }
  });

  $("#input-btn-cancel-update-user").bind("click", function() {
    userAvatar = null;
    userInfo = {};
    $("#user-modal-avatar").attr("src", originAvatarSrc);
    $("#input-change-avatar").val(null);

    $("#input-change-username").val(originUserInfo.username);

    originUserInfo.gender === "male"
      ? $("#input-change-gender-male").click()
      : $("#input-change-gender-female").click();
      
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);
  });

  $("#input-btn-update-user-password").bind("click", function() {
    if (
      !userUpdatePassword.currentPassword &&
      !userUpdatePassword.newPassword &&
      !userUpdatePassword.confirmNewPassword
    ) {
      alertify.notify("Bạn phải nhập đầy đủ thông tin", "error", 6);
      return false;
    }

    Swal.fire({
      title: "Bạn có chắc chắn muốn thay đổi mật khẩu?",
      text: "Bạn không thể hoàn tác lại quá trình này.!",
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "xác nhận!",
      cancelButtonText: "Hủy."
    }).then(result => {
      if (!result.value) {
        $("#input-btn-cancel-update-user-password").click();
        return false;
      }
      callUpdateUserPassword();
    });
  });

  $("#input-btn-cancel-update-user-password").bind("click", function() {
    userUpdatePassword = {};
    $("#input-change-current-password").val(null);
    $("#input-change-new-password").val(null);
    $("#input-change-confirm-new-password").val(null);
  });
});
