export const tranValidation = {
  email_incorrect: "email phải có dạng example@gmail.com!",
  gender_incorrect: "tại sao bạn lại không có giới tính!",
  password_incorrect: "mật khẩu phải bao gồm ít nhất 8 kí tự, chữ hoa, chữ thường, số và kí tự đặc biệt!",
  password_confirmation_incorrect: "Nhập lại mật khẩu!",
  update_username: 'Tên chỉ được phép giới hạn đến 3-17 kí tự, không được phép chứa kí tự đặc biệt !',
  update_gender: 'OMG…! Bạn đang muốn hack à.!',
  update_address: 'Đia chỉ giới hạn từ  3 – 30 kí tự.!',
  update_phone: 'Số điện thoại bắt đầu bằng 0 và kết thúc, giới hạn từ 10 đén 11 số.!',
  find_users_contact: "Không cho phép kí tự đặc biệt, chỉ cho phép chứ số và khoảng trống",
  message_text_emoji_incorrect: "tin nhắn không hợp lệ đăm bảo ít nhất 1 kí tự,  tối đa 500",
  add_new_group_users_incorrect: "Nhóm tối thiểu phải có tối đa 3 thành viên",
  add_new_group_name_incorrect: "Vui lòng nhập tên nhóm trò chuyện từ 1 đến 30 kí tự và không chứa các kí tự đặc biệt"
}

export const transErrors = {
  account_in_use: 'email này đã được sử dụng',
  account_removed:'tài khoản này đã được gỡ khỏi hệ thống, nếu tin điều này là sai, xin vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi',
  account_not_active:'email đã được đăng ký nhưng chưa active, xin vui lòng kiểm tra lại hoặc liên hệ với bộ phận hỗ trợ của chúng tôi',
  account_undefined: 'tài khoản nay không tồn tại',
  token_undefined: 'token không tồn tại, tài khoản đã active!',
  login_failed: 'sai tài khoản hoặc mật khẩu',
  server_error: "có lỗi ở phía server, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để báo cáo lỗi này. Xin cảm ơn",
  avatar_type: "Kiểu file không hợp lệ chỉ chấp nhận jpg & png",
  avatar_size: "Ảnh vượt quá dung lượng 1MB",
  user_current_password_failded: 'Mật khẩu hiện tại không chính xác',
  conversation_not_found: "Cuộc trò chuyện không tồn tại",
  image_message_type: "Kiểu file không hợp lệ chỉ chấp nhận jpg & png",
  image_message_size: "Ảnh vượt quá dung lượng 1MB",
  attachment_message_size: "tệp tin đính kèm vượt quá dung lượng 1MB",
}

export const transSuccess = {
  userCreated: (userEmail) => {
    return `tai khoan <strong>${userEmail}</strong> đã được tạo, xin vui lòng kiểm tra email để active trước khi đăng nhập. Xin cảm ơn.`
  },
  account_actived: 'kích hoạt tài khoản thành công bạn đã có thể dăng nhập vào ứng dụng',
  loginSuccess: (username) => {
    return `xin chào ${username}, chúc bạn một ngày tốt lành`
  },
  logout_success: 'Đăng xuất tài khoản thành công, hẹn gặp lại bạn !',
  user_info_updeted: 'cập nhật thông tin thành công',
  user_password_updated: "Cập nhật mật khẩu thành công"
}

export const transMail = {
  subject: "Awesome chat: xac nhan kich hoat tai khoan.",
  template: linkVerify => {
    return  `
      <h2>B.ạn đã nhận được email này vì đã đăng ký tài khoản tren awesome chat</h2>
      <h3>Vui lòng click vào liên kết  vào link bên dưới để kich hoạt tài khoản</h3>
      <h3><a href=${linkVerify} target=${linkVerify}/>${linkVerify}</h3>
      <h4>Nếu tin rằng email là nhầm lẫn xin bỏ qua nó. Xin cảm ơn!</h4>
    `;
  },
  send_fail: 'Có lỗi trong quá trình gửi email, xin vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi'
};
