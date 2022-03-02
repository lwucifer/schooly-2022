<template>
  <form @submit.prevent="handleRegister">
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
      <app-input
        type="password"
        v-model="CfmPassword"
        placeholder="Nhập lại mật khẩu"
        :error="validation.CfmPassword.isError"
        :message="validation.CfmPassword.errorMsg"
        :validate="validation.CfmPassword.errorType"
        @input="handleCfmPassword"
      >
        <template v-slot:prepend-inner>
          <div class="icon-inner-input">
            <IconLock24px />
          </div>
        </template>
      </app-input>
      <app-input
        type="text"
        v-model="fullname"
        placeholder="Họ và tên"
        class="mb-2"
        :error="validation.fullname.isError"
        :message="validation.fullname.errorMsg"
        :validate="validation.fullname.errorType"
        @input="handleFullname"
      >
        <template v-slot:prepend-inner>
          <div class="icon-inner-input">
            <IconPerson24px />
          </div>
        </template>
      </app-input>
      <p class="color-red text-center full-width" v-if="errorRespon">
        {{ messageErrorRegister }}
      </p>
    </div>
    <app-button
      color="primary"
      type="submit"
      square
      :loading="loading"
      fullWidth
      :disabled="disabledBtnRegister"
      @click.prevent="handleRegister"
      >Đăng ký</app-button
    >
  </form>
</template>

<script>
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions, mapMutations } from "vuex";
import {
  createSignupWithEmail,
  createSignupWithPhone
} from "~/models/auth/Signup";
import {
  formatPhoneNumber,
  validatePassword,
  validateEmail,
  validatePhone
} from "~/utils/validations";
import { ERRORS } from "~/utils/error-code";
import IconMail24px from "~/assets/svg/v2-icons/mail_24px.svg?inline";
import IconLock24px from "~/assets/svg/v2-icons/lock_24px.svg?inline";
import IconPerson24px from "~/assets/svg/v2-icons/person_24px.svg?inline";
export default {
  components: {
    IconMail24px,
    IconLock24px,
    IconPerson24px
  },
  data() {
    return {
      username: "",
      password: "",
      fullname: "",
      CfmPassword: "",
      modalConfirmEmail: false,
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
        },
        CfmPassword: {
          isError: false,
          errorMsg: "",
          errorType: ""
        },
        fullname: {
          isError: false,
          errorMsg: "",
          errorType: ""
        }
      },
      errorRespon: false,
      messageErrorRegister: "",
      loginType: "",
      loading: false
    };
  },
  computed: {
    disabledBtnRegister() {
      const btnDisabled =
        this.validation.username.isError ||
        this.validation.password.isError ||
        this.validation.CfmPassword.isError ||
        this.validation.fullname.isError ||
        this.errorRespon;
      if (
        !this.username ||
        !this.password ||
        !this.CfmPassword ||
        !this.fullname
      )
        return true;
      return btnDisabled;
    }
  },
  methods: {
    ...mapActions("auth", ["register", "sendotp", "status", "verifiOtp"]),
    ...mapMutations("auth", ["savePhonePass"]),

    handleRegister() {
      if (this.loginType == "email") {
        this.registerEmail();
      } else if (this.loginType == "phone") {
        this.registerPhone();
      }
    },

    async registerEmail() {
      try {
        // validate username
        if (this.disabledBtnRegister) {
          return;
        }

        this.loading = true;
        const token = await this.$recaptcha.execute("register");
        console.log("ReCaptcha token:", token);
        let registerModel = createSignupWithEmail(
          this.username,
          this.password,
          this.fullname,
          token
        );

        const doAdd = this.register(registerModel).then(result => {
          if (result.success == true) {
            this.loading = false;
            this.$router.push(`/auth/signup/email?email=${this.username}`);
          } else {
            this.showErrorWhenRegister(result);
            this.loading = false;
          }
        });
      } catch (error) {
        console.log("Login error:", error);
      }
    },

    async registerPhone() {
      console.log("[registerPhone]");
      try {
        if (this.disabledBtnRegister) {
          return;
        }

        this.loading = true;
        const tokenCheckPhone = await this.$recaptcha.execute("status");
        const dataChecKPhone = {
          phone: `+${formatPhoneNumber(this.username)}`,
          g_recaptcha_response: tokenCheckPhone
        };
        const doAdd = this.status(dataChecKPhone).then(result => {
          if (result.data == false) {
            const data = {
              phone: `+${formatPhoneNumber(this.username)}`,
              appVerifier: window.recaptchaVerifier
            };
            this.sendotp(data).then(result => {
              if (!result.code) {
                this.loading = false;
                this.savePhonePass({
                  phone: this.username,
                  password: this.password,
                  fullname: this.fullname
                });
                // this.$router.push(`/auth/signup/otp`);
                this.$emit("hanldeCheckOtp");
              } else {
                this.loading = false;
                this.errorRespon = true;
                this.messageErrorRegister =
                  "Số điện thoại bạn nhập không chính xác";
              }
            });
          } else {
            this.loading = false;
            this.errorRespon = true;
            this.messageErrorRegister = "Số điện thoại bạn nhập đã đăng ký";
          }
        });
      } catch (error) {
        console.log("[registerPhone] error", error);
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
      this.validation.password.errorMsg = "";

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

      // validate success
      this.validation.password.isError = false;
      this.validation.password.errorType = 1;
      this.validation.password.errorMsg = "";
    },
    handleCfmPassword() {
      this.errorRespon = false;
      this.validation.CfmPassword.isError = false;
      this.validation.CfmPassword.errorMsg = "";

      // validate required
      if (this.password !== this.CfmPassword) {
        // console.log("[handleCfmPassword]", this.password, this.CfmPassword);
        this.validation.CfmPassword.errorMsg = "Mật khẩu không khớp nhau";
        this.validation.CfmPassword.errorType = 2;
        this.validation.CfmPassword.isError = true;
        return false;
      }

      // validate success
      this.validation.CfmPassword.isError = false;
      this.validation.CfmPassword.errorType = 1;
      this.validation.CfmPassword.errorMsg = "";
    },
    handleFullname() {
      this.errorRespon = false;
      this.validation.fullname.isError = false;
      this.validation.fullname.errorMsg = "";

      // validate required
      if (!this.fullname) {
        this.validation.fullname.errorMsg = "Trường họ và tên là bắt buộc";
        this.validation.fullname.errorType = 2;
        this.validation.fullname.isError = true;
        return false;
      }

      // min|max length
      if (this.fullname.length < 2 || this.fullname.length > 32) {
        this.validation.fullname.errorMsg =
          "Họ và tên phải có ít nhất 2 ký tự và nhiều nhất là 32 ký tự";
        this.validation.fullname.errorType = 2;
        this.validation.fullname.isError = true;
        return false;
      }

      // validate success
      this.validation.fullname.isError = false;
      this.validation.fullname.errorType = 1;
      this.validation.fullname.errorMsg = "";
    },
    showErrorWhenRegister(error) {
      this.errorRespon = true;
      let message = "";
      switch (error.code) {
        case ERRORS.REGISTER.REQUIRED:
          message =
            "Invalid parameter. Required: email or phone, g_recaptcha_response, password. verify_token is required if register by phone number";
          break;
        case ERRORS.REGISTER.EMAIL_PHONE_USED:
          message = "Tài khoản đã tồn tại";
          break;
        case ERRORS.REGISTER.PASSWORD_LEAST:
          message =
            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái in hoa, thường và 1 chữ số";
          break;
        default:
          message = "Đã có lỗi xảy ra. Vui lòng thử lại sau";
          break;
      }
      this.messageErrorRegister = message;
    }
  }
};
</script>

<style lang="scss"></style>
