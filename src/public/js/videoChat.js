function videoChat(divId) {
  $(`#video-chat-${divId}`).unbind("click").on("click", function() {
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();

    let dataToEmit = {
      listenerId : targetId,
      callerName : callerName
    };
    
    // step 01: of caller: check user 2 online? 
    socket.emit("caller-check-listener-online-or-not", dataToEmit);
    
  });
};

$(document).ready(function() {
  // step 02 of caller
  socket.on("server-send-listener-is-offline", function() {
    alertify.notify("Người dùng này hiện không trực tuyến.", "error", 6);
  })

  let getPeerId = "";
  const peer = new Peer();
  peer.on("open", function(peerId) {
    getPeerId = peerId;
  });
  // step 03 of listener
  socket.on("server-request-peerId-of-listener", function(response) {
    let listenerName = $("#navbar-username").text();
    let dataToEmit = {
      callerId : response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeerId: getPeerId,
    };

    // step 04 of listener
    socket.emit("listener-emit-peer-id-to-server", dataToEmit)
  });

  // step 05 of caller
  socket.on("server-send-peerId-of-listener-to-caller", function(response) {
    let dataToEmit = {
      callerId : response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId,
    };

    // step 6: of caller
    socket.emit("caller-request-call-to-server", dataToEmit);
    let timerInterval;
    Swal.fire({
      title: `Đang gọi cho  &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thoi gian: <strong style="color: #d43f3a;"></strong> s <br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">
          Hủy cuộc gọi
        </button>
      `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      with: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $("#btn-cancel-call").unbind("click").on("click",function() {
          Swal.close();
          clearInterval(timerInterval);
          
          //step 07: of caller
          socket.emit("caller-cancel-request-to-server", dataToEmit)
        })
        Swal.showLoading();
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(
            Swal.getTimerLeft() / 1000
          );
        }, 1000);
      },
      onOpen: () => {
        // step 12 of caller
        socket.on("server-send-reject-call-to-caller", function(response) {
          Swal.close();
          clearInterval(timerInterval);

          Swal.fire({
            type: "info",
            title: `<span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; Đang bận`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            with: "52rem",
            allowOutsideClick: false, 
            confirmButtonColor: "#2eCC71",
            confirmButtonText: "Xác nhận"
          });
        });

        // step 13 of caller
        socket.on("server-send-accept-call-to-caller", function (response) { 
          Swal.close();
          clearInterval(timerInterval);
          alertify.notify(`ok ok....${response}`, "success", 3)
          //
        })
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then(result => {
      return false;
    });
  });

  // step 08 of listener
  socket.on("server-send-request-call-to-listener", function(response) {
    let dataToEmit = {
      callerId : response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId,
    };

    let timerInterval;
    Swal.fire({
      title: `<span style="color: #2ECC71;">${response.callerName}</span> đamg gọi cho bạn &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thoi gian: <strong style="color: #d43f3a;"></strong> s <br/><br/>
        <button id="btn-reject-call" class="btn btn-danger">
          Từ chối
        </button>
        <button id="btn-accept-call" class="btn btn-success">
          Đồng ý
        </button>
      `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      with: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $("#btn-reject-call").unbind("click").on("click",function() {
          Swal.close();
          clearInterval(timerInterval);
          
          // step 10 of listener
          socket.emit("listener-reject-request-call-to-server", dataToEmit);
        });

        $("#btn-accept-call").unbind("click").on("click",function() {
          Swal.close();
          clearInterval(timerInterval);
          
          // step 11 of listener
          socket.emit("listener-accept-request-call-to-server", dataToEmit);
        });

        Swal.showLoading();
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(
            Swal.getTimerLeft() / 1000
          );
        }, 1000);
      },
      onOpen: () => {
        // step 9: of listener
        socket.on("server-send-cancel-request-call-to-listener", function(response) {
          Swal.close();
          clearInterval(timerInterval);
        });

        // step 14 of listener
        socket.on("server-send-accept-call-to-listener", function (response) { 
          Swal.close();
          clearInterval(timerInterval);
          alertify.notify(`ok ok....${response} `, "success", 3)
          //
        })
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then(result => {
      return false;
    });
  })


});