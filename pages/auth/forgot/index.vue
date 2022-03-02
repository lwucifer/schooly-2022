<template>
  <div class="container">
    <div id="label-verify-phone"></div>
    <div class="row" v-if="checkRowHide">
      <div class="col-md-6 d-flex align-items-center">
        <div class="wrap-forgot-psw">
          <h3 class="text-primary">Quên mật khẩu?</h3>
          <div class="auth_content mt-5">
            <app-input
              :message="messageErrorForgot"
              :error="errorForgot"
              :validate="validateForgot"
              type="text"
              v-model="email"
              placeholder="Nhập số điện thoại hoặc email"
              @input="hanldeEmail"
            />
            <app-button
              :loading="loading"
              color="primary"
              square
              @click="hanldeShowModalOTP"
              class="mb-3 btn-restore"
            >Khôi phục mật khẩu</app-button>
          </div>
        </div>
        <app-modal
          centered
          :width="400"
          :component-class="{ 'auth-modal': true }"
          v-if="modalConfirmEmail"
        >
          <!-- <h3 class="color-primary" slot="header">Đăng ký thành công</h3> -->

          <div slot="content">
            <p class="line-height-2">
              <br />Vui lòng xác thực tài khoản qua email
              <br />
              <span class="color-primary">{{this.email}}</span>
            </p>
            <n-link
              :to="'/auth/forgot/confirmsuccess'"
              class="color-white btn btn--size-md btn--full-width btn--color-primary btn--square"
            >Xác thực tài khoản</n-link>
          </div>
        </app-modal>
      </div>
      <div class="col-md-6 text-center">
        <ImageAuth />
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-md-6">
        <div class="wrap-change-psw">
          <ChangePassPhone />
        </div>
      </div>
      <div class="col-md-6 text-center">
        <ImageAuth />
      </div>
    </div>
  </div>
</template>

<script>
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions, mapMutations } from "vuex";
import {
  createResetWithPhone,
  createResetWithEmail
} from "~/models/auth/Forgot";
import { formatPhoneNumber } from "~/utils/validations";
import firebase from "@/services/firebase/FirebaseInit";
import { ERRORS } from "~/utils/error-code";
import { APP_INPUT_VALIDATE_STATUS as VALIDATE_STATUS } from "~/utils/constants";
import ImageAuth from "~/components/page/auth/ImageAuth";
import ChangePassPhone from "~/components/page/auth/forgot/ChangePassPhone";
export default {
  components: { ImageAuth, ChangePassPhone },
  async asyncData({ store, query }) {
    return { checkEmail: query.email ? true : false };
  },
  data() {
    return {
      phone: "",
      email: "",
      password: "",
      error: false,
      showModalOTP: false,
      otp: "",
      modalConfirmEmail: false,
      errorRespon: false,
      messageErrorForgot: "",
      errorForgot: false,
      validateForgot: "",
      checkRowHide: true,
      loading: false
    };
  },

  async mounted() {
    await this.$recaptcha.init();

    // Start Firebase invisible reCAPTCHA verifier
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "label-verify-phone",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("RecaptchaVerifier resolved");
        }
      }
    );
  },

  methods: {
    ...mapActions("auth", ["resetPasswordRequest", "sendotp"]),
    ...mapMutations("auth", ["savePhoneState"]),
    hanldeEmail() {
      this.errorForgot = false;
      this.validateForgot = "";
      this.messageErrorForgot = "";
    },
    async resetPass() {
      try {
        const token = await this.$recaptcha.execute("login");
        console.log("ReCaptcha token:", token);
        const checkText = this.email.includes("@");
        let resetModel = createResetWithEmail(this.email, token);
        const doAdd = this.resetPasswordRequest(resetModel).then(result => {
          if (result.success == true) {
            this.loading = false;
            this.$router.push("/auth/forgot/confirmsuccess");
          } else {
            this.showErrorForgot(result);
            this.loading = false;
          }
        });
      } catch (error) {
        console.log("Login error:", error);
      }
    },
    hanldeShowModalOTP() {
      this.loading = true;
      if (this.email == "") {
        this.loading = false;
        this.validateForgot = VALIDATE_STATUS.ERROR;
        this.messageErrorForgot =
          "Vui lòng nhập email hoặc số điện thoại cần khôi phục";
      } else {
        if (!this.email.includes("@")) {
          this.savePhoneState(this.email);
          const data = {
            phone: `+${formatPhoneNumber(this.email)}`,
            appVerifier: window.recaptchaVerifier
          };
          this.sendotp(data).then(result => {
            console.log("result huydv", result);
            if (!result.code) {
              console.log("result huydv11111", result);
              this.checkRowHide = false;
              this.loading = false;
              // this.$router.push(`/auth/forgot/changepass?phone=${this.email}`);
            } else {
              this.loading = false;
              this.validateForgot = VALIDATE_STATUS.ERROR;
              this.errorForgot = true;
              if (result && result.code == "auth/invalid-phone-number") {
                this.messageErrorForgot = "Số điện thoại bạn nhập không hợp lệ";
              } else {
                this.messageErrorForgot = "Có lỗi. Xin vui lòng thử lại";
              }
            }
          });
        } else {
          this.resetPass();
        }
      }
    },
    showErrorForgot(error) {
      this.errorForgot = true;
      this.validateForgot = VALIDATE_STATUS.ERROR;
      let message = "";
      switch (error.code) {
        case ERRORS.REGISTER.REQUIRED:
          message =
            "Invalid parameter. Required: email or phone, g_recaptcha_response, password. verify_token is required if register by phone number";
          break;
        case ERRORS.FORGOT_PASSWORD.USER_NOT_FOUND:
          message = "Tài khoản không tồn tại";
          break;
        default:
          message = "Đã có lỗi xảy ra. Vui lòng thử lại sau";
          break;
      }
      this.messageErrorForgot = message;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth.scss";
@import "~/assets/scss/components/auth/_auth-v2.scss";
</style>