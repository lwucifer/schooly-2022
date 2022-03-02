<template>
  <div class="auth__main">
    <h3 class="text-primary">Thay đổi mật khẩu</h3>
    <div class="auth_content mt-5 px-2 d-flex flex-column">
      <app-input
        maxlength="6"
        type="text"
        v-model="otp"
        placeholder="Nhập mã OTP"
        :error="$v.otp.$invalid"
        :message="errorMessage.otp"
        :validate="validateProps.otp"
        @input="handleOtp"
      />
      <app-input
        type="password"
        v-model="password"
        placeholder="Nhập mật khẩu mới"
        :error="$v.password.$invalid || validate.password"
        :message="errorMessage.password"
        :validate="validateProps.password"
        autocomplete="new-password"
        @input="handlePassword"
      />
      <app-input
        type="password"
        v-model="coPassword"
        placeholder="Xác nhận mật khẩu"
        :error="$v.coPassword.$invalid || validate.coPassword"
        :message="errorMessage.coPassword"
        :validate="validateProps.coPassword"
        autocomplete="new-password"
        class="mb-2"
        @input="handleCoPassword"
      />
      <p class="color-red text-center full-width" v-if="errorRespon">{{messageErrorChange}}</p>
      <div>
        <app-button
          :loading="loading"
          color="primary"
          square
          @click="acceptResetPass"
          class="mb-3 mt-4"
          style="width:293px;height:41px"
          :disabled="disabledBtnForgot"
        >Xác nhận</app-button>
      </div>
      <a
        @click="sendOTP"
        :class="countDown === 0 ? '' : 'disable'"
        class="btn-send-otp"
        style="color:#E6A01E;"
      >Gửi lại mã xác thực ({{countDown}}s)</a>
    </div>
  </div>
</template>

<script>
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";
import { createResetPassWithPhone } from "~/models/auth/Forgot";
import { formatPhoneNumber, validatePassword } from "~/utils/validations";
import { ERRORS } from "~/utils/error-code";
import {
  required,
  minLength,
  sameAs,
  maxLength
} from "vuelidate/lib/validators";
import firebase from "@/services/firebase/FirebaseInit";

export default {
  components: {},

  data() {
    return {
      otp: "",
      password: "",
      coPassword: "",
      error: false,
      countDownDefault: 120,
      countDown: 120,
      verify_token: "",
      phone: "",
      queryEmail: false,
      code: "",
      errorMessage: {
        otp: "",
        password: "",
        coPassword: ""
      },
      validateProps: { password: "", otp: "", coPassword: "" },
      validate: { password: true },
      errorRespon: false,
      messageErrorChange: "",
      loading: false
    };
  },
  validations: {
    otp: { required, minLength: minLength(6) },
    password: { required },
    coPassword: { required, sameAsPassword: sameAs("password") }
  },

  async mounted() {
    this.phone = this.$route.query.phone ? this.$route.query.phone : "";
    // console.log("huydv phone", this.phone);
  },

  computed: {
    ...mapState("auth", ["firebaseToken", "phoneSave"]),
    disabledBtnForgot() {
      const btnDisabled = this.$v.$invalid || this.validate.password;
      return btnDisabled;
    }
  },

  methods: {
    ...mapActions("auth", ["forgotPassword", "verifiOtp", "sendotp"]),
    async acceptResetPass() {
      this.loading = true;
      try {
        const token = await this.$recaptcha.execute("resetpass");
        console.log("ReCaptcha token:", token);
        await this.verifiOtp(this.otp).then(result => {
          console.log("result huydv", result);
          if (result && result.user) {
            this.verify_token = result.user._lat;
            const resetPassModelPhone = createResetPassWithPhone(
              `+${formatPhoneNumber(this.phoneSave)}`,
              this.verify_token,
              this.password,
              token
            );
            const doAdd = this.forgotPassword(resetPassModelPhone).then(res => {
              if (res.success == true) {
                this.loading = false;
                this.$router.push("/auth/forgot/success");
              } else {
                this.loading = false;
                this.showErrorChangePass(result);
              }
            });
          } else {
            this.loading = false;
            this.showErrorOtp(result);
          }
        });
      } catch (error) {
        console.log("Login error:", error);
      }
    },
    showErrorOtp(error) {
      this.errorRespon = true;
      if (error.code == "auth/invalid-verification-code") {
        this.messageErrorChange = "Mã OTP bạn nhập không đúng";
      } else if (error.code == "auth/code-expired") {
        this.messageErrorChange = "Mã OTP của bạn nhập đã hết hạn";
      } else {
        this.messageErrorChange = "Có lỗi. Xin vui lòng thử lại";
      }
    },
    handleOtp() {
      this.clearError();
      this.otp = this.otp.replace(/\D/g, "");
      this.validateProps.otp = "";
      if (!this.$v.otp.required) {
        this.validateProps.otp = 2;
        this.errorMessage.otp = "Trường này là bắt buộc";
      } else if (!this.$v.otp.minLength) {
        this.validateProps.otp = 2;
        this.errorMessage.otp = "Mã OTP có 6 ký tự";
      } else {
        this.validateProps.otp = 1;
        this.errorMessage.otp = "";
      }
    },
    handlePassword(_password) {
      this.clearError();
      this.validate.password = true;
      this.validateProps.password = "";
      if (!this.$v.password.required) {
        this.validateProps.password = 2;
        this.errorMessage.password = "Trường này là bắt buộc";
      } else if (validatePassword(_password)) {
        this.validateProps.password = 1;
        this.validate.password = false;
        this.errorMessage.password = "";
      } else if (!validatePassword(_password)) {
        this.validateProps.password = 2;
        this.errorMessage.password =
          "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái in hoa, thường và 1 chữ số";
      }
    },
    handleCoPassword() {
      this.clearError();
      if (!this.$v.coPassword.required) {
        this.validateProps.coPassword = 2;
        this.errorMessage.coPassword = "Trường này là bắt buộc";
      } else if (!this.$v.coPassword.sameAsPassword) {
        this.validateProps.coPassword = 2;
        this.errorMessage.coPassword = "Xác nhận mật khẩu không khớp";
      } else {
        this.validateProps.coPassword = 1;
        this.errorMessage.coPassword = "";
      }
    },
    sendOTP() {
      const that = this;
      const data = {
        phone: `+${formatPhoneNumber(this.phoneSave)}`,
        appVerifier: window.recaptchaVerifier
      };
      this.sendotp(data);
      if (that.countDown === 0) {
        that.countDown = that.countDownDefault;
        that.countDownTimer();
      }
    },
    countDownTimer() {
      const that = this;
      if (that.countDown > 0) {
        setTimeout(() => {
          that.countDown -= 1;
          that.countDownTimer();
        }, 1000);
      }
    },
    showErrorChangePass(error) {
      this.errorRespon = true;
      let message = "";
      switch (error.code) {
        case ERRORS.REGISTER.REQUIRED:
          message =
            "Invalid parameter. Required: email or phone, g_recaptcha_response, password. verify_token is required if register by phone number";
          break;
        case ERRORS.REGISTER.PASSWORD_LEAST:
          message =
            "Invalid password. Password must at least 8 characters, include lowercase, uppercase and number";
          break;
        default:
          message = "Đã có lỗi xảy ra. Vui lòng thử lại sau";
          break;
      }
      this.messageErrorChange = message;
    },
    clearError() {
      this.errorRespon = false;
      this.messageErrorChange = "";
    }
  },

  created() {
    this.countDownTimer();
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth.scss";
</style>