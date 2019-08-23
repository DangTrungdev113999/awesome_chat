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

function playVideoStream(videoTagId, steam) {
  let video = document.getElementById(videoTagId);
  video.srcObject = steam;
  video.onloadeddata = function() {
    video.play();
  };
}

function closeVideoStream(stream) {
  return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function() {
  // step 02 of caller
  socket.on("server-send-listener-is-offline", function() {
    alertify.notify("Người dùng này hiện không trực tuyến.", "error", 6);
  })

  let iceServer = $("#ice-server-list").val();

  let getPeerId = "";
  const peer = new Peer({
    key: "peerjs",
    host: "peerjs-server-trungquandev.herokuapp.com",
    secure: true,
    port: 443,
    config: {"iceServers": JSON.parse(iceServer)}
    // debug: 3
  });
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

  let timerInterval;
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

        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(
              Swal.getTimerLeft() / 1000
            );
          }, 1000);
        }
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

        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(
              Swal.getTimerLeft() / 1000
            );
          }, 1000);
        }
      },
      onOpen: () => {
        // step 09: of listener
        socket.on("server-send-cancel-request-call-to-listener", function(response) {
          Swal.close();
          clearInterval(timerInterval);
        });

      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then(result => {
      return false;
    });
  })

  // step 13 of caller
  socket.on("server-send-accept-call-to-caller", function (response) { 
    Swal.close();
    clearInterval(timerInterval);
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    
    getUserMedia({video: true, audio: true}, function(stream) {
        // show modal steaming
        $("#streamModal").modal("show");
        
        // play my stream in local (of caller)
        playVideoStream("local-stream", stream);
        
        // call to listener
        let call = peer.call(response.listenerPeerId, stream);

        call.on("stream", function(remoteStream) {
          // play steam  (of listener)
          playVideoStream("remote-stream", remoteStream);
        });
        
        // close modal remove steam
        $("#streamModal").on("hidden.bs.modal", function() {
          closeVideoStream(stream);

          Swal.fire({
            type: "info",
            title: `đã kể thúc cuộc gọi với &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span>`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            with: "52rem",
            allowOutsideClick: false, 
            confirmButtonColor: "#2eCC71",
            confirmButtonText: "Xác nhận"
          });
        })

    }, function(err) {
      if (err.toString() === "NotAllowedError: Permission defind") {
        alertify.notify("Xin bạn đã tắt quyền truy cập nghe gọi trên trình duyệt, vui lòng vào phần cải đặt để bật", "error", 6);
      }
      if (err.toString() === "NotAllowedError: Requested device not found") {
        alertify.notify("Xin lỗi chúng tôi không tìm thấy thiết bj nghe gọi trên máy tính của bạn", "error", 6);
      }
    });
  })

  // step 14 of listener
  socket.on("server-send-accept-call-to-listener", function (response) { 
    Swal.close();
    clearInterval(timerInterval);
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    
    peer.on('call', function(call) {
      getUserMedia({video: true, audio: true}, function(stream) {
        // show modal steaming
        $("#streamModal").modal("show");

        // play my stream in local (of listener)
        playVideoStream("local-stream", stream);

        call.answer(stream); // Answer the call with an A/V stream.

        call.on('stream', function(remoteStream) {
          // play steam  (of caller)
          playVideoStream("remote-stream", remoteStream);
        });

        // close modal remove steam
        $("#streamModal").on("hidden.bs.modal", function() {
          closeVideoStream(stream);
          Swal.fire({
            type: "info",
            title: `đã kể thúc cuộc gọi với  &nbsp;<span style="color: #2ECC71;">${response.callerName}</span> `,
            backdrop: "rgba(85, 85, 85, 0.4)",
            with: "52rem",
            allowOutsideClick: false, 
            confirmButtonColor: "#2eCC71",
            confirmButtonText: "Xác nhận"
          });
        })
      }, function(err) {
        if (err.toString() === "NotAllowedError: Permission defind") {
          alertify.notify("Xin bạn đã tắt quyền truy cập nghe gọi trên trình duyệt, vui lòng vào phần cải đặt để bật", "error", 6);
        }

        if (err.toString() === "NotAllowedError: Requested device not found") {
          alertify.notify("Xin lỗi chúng tôi không tìm thấy thiết bj nghe gọi trên máy tính của bạn", "error", 6);
        }
      });
    });
  })

});