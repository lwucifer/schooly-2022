<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div class="wrap-success-auth px-4">
          <h3 class="text-primary">Xác thực tài khoản</h3>
          <div class="auth_content mt-4 px-5">
            <app-input
              type="text"
              v-model="otp"
              maxlength="6"
              :error="modalOtp.errorOtp"
              :message="modalOtp.messageErrorOtp"
              :validate="validateProps.otp"
              @input="hanldeOtp"
              placeholder="Nhập mã OTP"
            />
          </div>
          <app-button
            :loading="loading"
            color="primary"
            square
            class="btn-confirm"
            @click="submitOtp"
          >Xác thực tài khoản</app-button>
          <p class="color-red text-center full-width" v-if="errorRespon">{{messageErrorRegister}}</p>
        </div>
      </div>
      <div class="col-md-6 text-center">
        <ImageAuth />
      </div>
    </div>
  </div>
</template>

<script>
import ImageAuth from "~/components/page/auth/ImageAuth";
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";
import { ERRORS } from "~/utils/error-code";
import { createSignupWithPhone } from "~/models/auth/Signup";
import { formatPhoneNumber } from "~/utils/validations";

export default {
  // validate(store, redirect) {
  //   console.log("store", store.getters["auth/phonePass"]);
  //   return false;
  //   // if (store.state && store.state.auth && store.state.auth.phonePass) {
  //   //   return true;
  //   // }
  //   // return redirect("/auth/signup");
  // },
  components: {
    ImageAuth
  },

  data() {
    return {
      otp: "",
      modalOtp: {
        showModalOTP: false,
        errorOtp: false,
        messageErrorOtp: ""
      },
      validateProps: { otp: "" },
      errorRespon: false,
      messageErrorRegister: "",
      loading: false
    };
  },
  computed: {
    ...mapState("auth", ["phonePass"])
  },

  methods: {
    ...mapActions("auth", ["register", "sendotp", "status", "verifiOtp"]),
    async submitRegister() {
      try {
        const token = await this.$recaptcha.execute("register");
        console.log("ReCaptcha token:", token);
        const registerModel = createSignupWithPhone(
          `+${formatPhoneNumber(
            this.phonePass && this.phonePass.phone ? this.phonePass.phone : ""
          )}`,
          this.phonePass && this.phonePass.password
            ? this.phonePass.password
            : "",
          this.phonePass && this.phonePass.fullname
            ? this.phonePass.fullname
            : "",
          token,
          this.verify_token
        );
        console.log("register-model", registerModel);
        const doAdd = this.register(registerModel).then(result => {
          if (result.success == true) {
            this.loading = false;
            this.$router.push("/auth/signup/success");
          } else {
            this.showErrorWhenRegister(result);
            this.loading = false;
          }
        });
      } catch (error) {
        console.log("Login error:", error);
      }
    },
    async acceptOTP() {
      this.loading = true;
      await this.verifiOtp(this.otp).then(result => {
        // console.log("result huydv", result);
        if (result && result.user) {
          this.verify_token = result.user ? result.user._lat : "";
          // console.log("result huydv11111", result);
          this.submitRegister();
        } else {
          this.showErrorOtp(result);
          this.loading = false;
        }
      });
    },
    submitOtp() {
      this.acceptOTP();
    },
    showErrorOtp(error) {
      this.modalOtp.errorOtp = true;
      if (error && error.code == "auth/invalid-verification-code") {
        this.modalOtp.messageErrorOtp = "Mã OTP bạn nhập không đúng";
        this.validateProps.otp = 2;
      } else if (error && error.code == "auth/code-expired") {
        this.validateProps.otp = 2;
        this.modalOtp.messageErrorOtp = "Mã OTP của bạn nhập đã hết hạn";
      } else {
        this.validateProps.otp = 2;
        this.modalOtp.messageErrorOtp = "Có lỗi. Xin vui lòng thử lại";
      }
    },
    hanldeOtp() {
      this.modalOtp.errorOtp = false;
      this.modalOtp.messageErrorOtp = "";
      this.validateProps.otp = 0;
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
          message = "Email hoặc số điện thoạn đã được sử dụng";
          break;
        case ERRORS.REGISTER.PASSWORD_LEAST:
          message =
            "Invalid password. Password must at least 8 characters, include lowercase, uppercase and number";
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

<style lang="scss">
@import "~/assets/scss/components/auth/_auth-v2.scss";
</style>