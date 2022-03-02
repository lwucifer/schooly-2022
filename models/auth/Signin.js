class SigninByPhone {
  constructor(phone, password, recaptcha) {
    this.phone = phone;
    this.password = password;
    this.g_recaptcha_response = recaptcha;
  }
}

class SigninByEmail {
  constructor(email, password, recaptcha) {
    this.email = email;
    this.password = password;
    this.g_recaptcha_response = recaptcha;
  }
}

export function createSigninWithPhone(phone, password, recaptcha) {
  return Object.freeze(new SigninByPhone(phone, password, recaptcha));
}

export function createSigninWithEmail(email, password, recaptcha) {
  return Object.freeze(new SigninByEmail(email, password, recaptcha));
}