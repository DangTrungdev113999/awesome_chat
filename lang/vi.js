export const tranValidation = {
  email_incorrect: "email phai co dang example@gmail.com",
  gender_incorrect: "bede a",
  password_incorrect: "mat khau chua it nhat 8 ki tu, bao gom chu hoa, chu thuong, so, ki tu dac biet",
  password_confirmation_incorrect: "nhap lai mat khau",
}

export const transErrors = {
  account_in_use: 'email nay da duoc du dung.',
  account_removed:'tai khoan nay da bi go khoi he thong, neu tin rang dieu nay la hieu nham xin vui long lien he voi bo phan ho tro cua chung toi',
  account_not_active:'email nay da duoc dang ky nhng chua active tai khoan, vui long kiem tra email cua ban hoac lien he voi bo phan ho tro cua chung toi'
}

export const transSuccess = {
  userCreated: (userEmail) => {
    return `tai khoan <strong>${userEmail}</strong> da duoc tao, vui long kiem tra email cua ban de active tai khoan truoc khi dang nhap. Xin cam on`
    
  }
}
