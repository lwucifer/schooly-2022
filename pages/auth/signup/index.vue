<template>
  <div>
    <SignupOtp v-if="checkOtp" />
    <div class="container" v-else>
      <div id="label-verify-phone"></div>
      <div class="row">
        <div class="col-md-6">
          <div class="wrap-form_auth">
            <div class="head-form_auth">
              <h2>Tạo tài khoản</h2>
              <!-- <div class="auth__nav-v2">
                <a :class="byEmail ? 'active' : ''" @click="tabEmail">Email</a>
                <a :class="byEmail ? '' : 'active'" @click="tabPhone">Số điện thoại</a>
              </div> -->
            </div>
            <div class="px-4">
              <!-- <SignupEmail v-show="byEmail" />
              <SignupPhone v-show="!byEmail && !checkOtp" @hanldeCheckOtp="hanldeCheckOtp" /> -->
              <SignupForm v-show="!checkOtp" @hanldeCheckOtp="hanldeCheckOtp" />
            </div>
            <p class="title-either_auth">hoặc</p>
            <div class="text-dark">
              <p>Đăng ký nhanh với</p>
              <div class="mt-3 mb-15">
                <app-button class="btn-social btn-facebook">
                  <IconFacebook class="mr-2" />Facebook
                </app-button>
                <app-button class="btn-social btn-google">
                  <IconGoogle class="mr-2" />Google
                </app-button>
              </div>
              <div>
                <span>Đã có tài khoản?</span>
                <n-link :to="'/auth/signin'" class="bnt-auth">Đăng nhập</n-link>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 text-center">
          <ImageAuth />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconFacebook from "~/assets/svg/icons/facebook.svg?inline";
import IconGoogle from "~/assets/svg/icons/google.svg?inline";
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";
import firebase from "@/services/firebase/FirebaseInit";
import {
  createSignupWithPhone,
  createSignupWithEmail
} from "~/models/auth/Signup";
import { formatPhoneNumber } from "~/utils/validations";
import SignupEmail from "~/components/page/auth/signup/SignupEmail";
import SignupPhone from "~/components/page/auth/signup/SignupPhone";
import SignupForm from "~/components/page/auth/signup/SignupForm";
import SignupOtp from "./otp";
import ImageAuth from "~/components/page/auth/ImageAuth";
export default {
  middleware: "auth",
  components: {
    IconFacebook,
    IconGoogle,
    SignupEmail,
    SignupPhone,
    ImageAuth,
    SignupOtp,
    SignupForm
  },

  data() {
    return {
      phone: "",
      email: "",
      password: "",
      fullname: "",
      error: false,
      byEmail: true,
      statusValidate: 1,
      showModalOTP: false,
      listQuery: {},
      otp: "",
      verify_token: "",
      modalConfirmEmail: "",
      modalConfirmOTC: "",
      checkOtp: false
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

    // window.recaptchaVerifier.render().then(widgetId => {
    //   window.recaptchaWidgetId = widgetId;
    // });
  },

  methods: {
    tabPhone() {
      (this.byEmail = false), (this.password = ""), (this.fullname = "");
    },
    tabEmail() {
      (this.byEmail = true), (this.password = ""), (this.fullname = "");
    },
    redirectSignin() {
      this.$router.push("/auth/signin");
    },
    hanldeCheckOtp() {
      this.checkOtp = true;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth-v2.scss";
</style>
