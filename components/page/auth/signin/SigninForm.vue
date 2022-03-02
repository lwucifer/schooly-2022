<template>
  <form @submit.prevent="submitLogin">
    <div class="auth_content mb-4">
      <app-input
        type="text"
        v-model="username"
        placeholder="Nhập email hoặc số điện thoại"
        :error="validation.username.isError"
        :message="validation.username.errorMsg"
        :validate="validation.username.errorType"
        @input="handleUsername"
      >
        <template v-slot:prepend-inner>
          <div class="icon-inner-input">
            <IconMail24px />
          </div>
        </template>
      </app-input>
      <app-input
        type="password"
        v-model="password"
        placeholder="Nhập mật khẩu"
        class="mb-2"
        maxlength="127"
        :error="validation.password.isError"
        :message="validation.password.errorMsg"
        :validate="validation.password.errorType"
        autocomplete="new-password"
        @input="handlePassword"
      >
        <template v-slot:prepend-inner>
          <div class="icon-inner-input">
            <IconLock24px />
          </div>
        </template>
      </app-input>
      <p class="color-red text-center full-width" v-if="errorRespon">
        {{ messageErrorLogin }}
      </p>
    </div>
    <app-button
      type="submit"
      :disabled="disabledBtnLogin"
      color="primary"
      square
      fullWidth
      class="mb-3"
      :loading="loadingBtn"
      >Đăng nhập</app-button
    >
  </form>
</template>

<script>
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";
import {
  createSigninWithEmail,
  createSigninWithPhone
} from "~/models/auth/Signin";
import {
  validatePassword,
  validateEmail,
  validatePhone,
  formatPhoneNumber
} from "~/utils/validations.js";
import { ERRORS } from "~/utils/error-code";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
import IconMail24px from "~/assets/svg/v2-icons/mail_24px.svg?inline";
import IconLock24px from "~/assets/svg/v2-icons/lock_24px.svg?inline";
export default {
  components: {
    IconMail24px,
    IconLock24px
  },
  data() {
    return {
      username: "",
      password: "",
      validation: {
        username: {
          isError: false,
          errorMsg: "",
          errorType: ""
        },
        password: {
          isError: false,
          errorMsg: "",
          errorType: ""
        }
      },
      errorRespon: false,
      messageErrorLogin: "",
      loginType: "", // string: email|phone
      loadingBtn: false
    };
  },
  computed: {
    disabledBtnLogin() {
      const btnDisabled =
        this.validation.username.isError ||
        this.validation.password.isError ||
        this.errorRespon;
      console.log(
        "[btnDisabled]",
        this.validation.username.isError,
        this.validation.password.isError,
        this.errorRespon
      );
      if (!this.username || !this.password) return true;
      return btnDisabled;
    }
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async submitLogin() {
      console.log("[submitLogin]", this.disabledBtnLogin);
      try {
        if (this.disabledBtnLogin) {
          return;
        }

        this.loadingBtn = true;
        const token = await this.$recaptcha.execute("login");
        console.log("ReCaptcha token:", token);
        let loginModel = null;
        if (this.loginType == "email") {
          loginModel = createSigninWithEmail(
            this.username,
            this.password,
            token
          );
        } else if (this.loginType == "phone") {
          loginModel = createSigninWithPhone(
            `+${formatPhoneNumber(this.username)}`,
            this.password,
            token
          );
        } else {
          return;
        }

        const doAdd = this.login(loginModel).then(result => {
          if (result.success == true) {
            this.$emit("signin", true);
          } else {
            this.showErrorWhenLogin(result);
          }
          this.loadingBtn = false;
        });
      } catch (error) {
        console.log("Login error:", error);
      } finally {
        this.loadingBtn = false;
      }
    },
    handleUsername() {
      this.errorRespon = false;
      this.validation.username.isError = false;
      this.validation.username.errorMsg = "";
      this.loginType = "";

      // validate required
      if (!this.username) {
        this.validation.username.errorMsg =
          "Email hoặc số điện thoại là bắt buộc";
        this.validation.username.errorType = 2;
        this.validation.username.isError = true;
        return false;
      }

      // validate incaseof email
      if (validateEmail(this.username)) {
        this.loginType = "email";
      } else if (validatePhone(this.username)) {
        this.loginType = "phone";
      } else {
        this.validation.username.errorType = 2;
        this.validation.username.isError = true;
        this.validation.username.errorMsg =
          "Email hoặc số điện thoại không hợp lệ";
        return false;
      }

      // validate success
      this.validation.username.isError = false;
      this.validation.username.errorType = 1;
      this.validation.username.errorMsg = "";

      return true;
    },
    handlePassword() {
      this.errorRespon = false;
      this.validation.password.isError = false;

      // validate required
      if (!this.password) {
        this.validation.password.errorMsg = "Mật khẩu đăng nhập là bắt buộc";
        this.validation.password.errorType = 2;
        this.validation.password.isError = true;
        return false;
      }

      // validate incaseof email
      if (validatePassword(this.password)) {
        this.validation.password.isError = false;
        this.validation.password.errorType = 1;
        this.validation.password.errorMsg = "";
      } else {
        this.validation.password.errorType = 2;
        this.validation.password.isError = true;
        this.validation.password.errorMsg =
          "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái in hoa, thường và 1 chữ số";
        return false;
      }
    },
    showErrorWhenLogin(error) {
      this.errorRespon = true;
      let message = "";
      switch (error.code) {
        case ERRORS.LOGIN.REQUIRED:
          message =
            "Invalid parameter. Required: email or phone, password, g_recaptcha_response";
          break;
        case ERRORS.LOGIN.EMAIL_INVALID:
          message = "Tài khoản hoặc mật khẩu bạn nhập chưa đúng";
          break;
        case ERRORS.LOGIN.USER_LOCKED:
          message = "User is locked";
          break;
        case ERRORS.LOGIN.BAD_CREDEN:
          message = "Mật khẩu bạn nhập chưa đúng";
          break;
        case ERRORS.LOGIN.EMAIL_LEFT:
          message = "Email/phone or password is incorrect, 1 time left";
          break;
        case ERRORS.LOGIN.USER_INACTIVE:
          message = "Tài khoản chưa được xác thực";
          break;
        default:
          message = "Đã có lỗi xảy ra. Vui lòng thử lại sau";
          break;
      }
      this.messageErrorLogin = message;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth-modal.scss";
</style>
