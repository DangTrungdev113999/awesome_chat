function callFindUsers(element) {
  if (element.which === 13 || element.type === "click") {
    let keyword = $("#input_find_users_contact").val();
    let regexKeyword = new RegExp(
      /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    );

    if (!keyword.length) {
      alertify.notify("Bạn phải nhập thông tin tìm kiếm.!", "error", 6);
      return false;
    }

    if (!regexKeyword.test(keyword)) {
      alertify.notify(
        "Lỗi từ khóa tìm kiếm, bạn chỉ được nhập, chữ cái số và khoảng trống",
        "error",
        6
      );
      return false;
    }

    $.get(`/contact/find-users/${keyword}`, function(data) {
      $("#find-user ul").html(data);
      addContact(); // js/addContact.js
      removeRequestContactSent();
    });
  }
}

$(document).ready(function() {
  $("#input_find_users_contact").bind("keypress", callFindUsers);
  $("#btn_find_users_contact").bind("click", callFindUsers);
});
