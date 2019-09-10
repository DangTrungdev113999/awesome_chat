function chatUser() {
  $(".user-talk").unbind("click").on("click", function() {
    let targetId = $(this).data("uid");
    $("#contactsModal").modal("hide");
    $("ul.people").find(`a[data-target="#to_${targetId}"]`).click();
  });
}

$(document).ready(function() {
  chatUser();
})