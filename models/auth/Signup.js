class SignupByPhone {
    constructor(phone, password, fullname, recaptcha, firebase_token) {
        this.phone = phone;
        this.password = password;
        this.fullname = fullname;
        this.g_recaptcha_response = recaptcha;
        this.verify_token = firebase_token;
    }
}

class SignupByEmail {
    constructor(email, password, fullname, recaptcha) {
        this.email = email;
        this.password = password;
        this.fullname = fullname;
        this.g_recaptcha_response = recaptcha;
    }
}

export function createSignupWithPhone(
    phone,
    password,
    fullname,
    recaptcha,
    firebase_token
) {
    return Object.freeze(
        new SignupByPhone(phone, password, fullname, recaptcha, firebase_token)
    );
}

export function createSignupWithEmail(email, password, fullname, recaptcha) {
    return Object.freeze(new SignupByEmail(email, password, fullname, recaptcha));
}