class ResetWithPhone {
    constructor(phone, recaptcha) {
        this.phone = phone;
        this.g_recaptcha_response = recaptcha;
    }
}

class ResetWithEmail {
    constructor(email, recaptcha) {
        this.email = email;
        this.g_recaptcha_response = recaptcha;
    }
}

class ResetPassWithPhone {
    constructor(phone, firebase_token, password, recaptcha) {
        this.phone = phone;
        this.verify_token = firebase_token;
        this.new_pwd = password;
        this.g_recaptcha_response = recaptcha;
    }
}

class ResetPassWithEmail {
    constructor(email, code, password, recaptcha) {
        this.email = email;
        this.verify_token = code;
        this.new_pwd = password;
        this.g_recaptcha_response = recaptcha;
    }
}

export function createResetWithPhone(phone, recaptcha) {
    return Object.freeze(new ResetWithPhone(phone, recaptcha));
}

export function createResetWithEmail(email, recaptcha) {
    return Object.freeze(new ResetWithEmail(email, recaptcha));
}

export function createResetPassWithPhone(
    phone,
    firebase_token,
    password,
    recaptcha
) {
    return Object.freeze(
        new ResetPassWithPhone(phone, firebase_token, password, recaptcha)
    );
}

export function createResetPassWithEmail(email, code, password, recaptcha) {
    return Object.freeze(
        new ResetPassWithEmail(email, code, password, recaptcha)
    );
}