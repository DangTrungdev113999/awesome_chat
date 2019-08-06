export const tranValidation = {
  email_incorrect: "email phai co dang example@gmail.com",
  gender_incorrect: "bede a",
  password_incorrect: "mat khau chua it nhat 8 ki tu, bao gom chu hoa, chu thuong, so, ki tu dac biet",
  password_confirmation_incorrect: "nhap lai mat khau",
}

export const transErrors = {
  account_in_use: 'email nay da duoc du dung.',
  account_removed:'tai khoan nay da bi go khoi he thong, neu tin rang dieu nay la hieu nham xin vui long lien he voi bo phan ho tro cua chung toi',
  account_not_active:'email nay da duoc dang ky nhng chua active tai khoan, vui long kiem tra email cua ban hoac lien he voi bo phan ho tro cua chung toi',
  token_undefined: 'token không tồn tại, tài khoản đã active!',
}

export const transSuccess = {
  userCreated: (userEmail) => {
    return `tai khoan <strong>${userEmail}</strong> da duoc tao, vui long kiem tra email cua ban de active tai khoan truoc khi dang nhap. Xin cam on`
  },
  account_actived: 'kích hoạt tài khoản thành công bạn đã có thể dăng nhập vào ứng dụng'
}

export const transMail = {
  subject: "Awesome chat: xac nhan kich hoat tai khoan.",
  template: linkVerify => {
    return  `
      <h2>bạn đã nhan duoc email nay vi da dang ky tai khoan tren ung dung Awesome chat</h2>
      <h3>Vui long click vao lien ket vao link ben duoi de kich hoat tai khoan</h3>
      <h3><a href=${linkVerify} target=${linkVerify}/>${linkVerify}</h3>
      <h4>Neu tin rang email la nham lan hay bo qua no. Xin cam on</h4>
    `;
  },
  send_fail: 'co loi trong qua trinh gui email, vui long lien he voi bo phan ho tro cua chung toi'
};
