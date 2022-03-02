<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div id="label-verify-phone"></div>
        <div class="wrap-change-psw">
          <ChangePassEmail />
          <!-- <ChangePassPhone v-show="!checkEmail" /> -->
        </div>
        <!-- <div class="auth__main">
          <h3>Quên mật khẩu?</h3>
          <div class="auth_content mt-5">
            <app-input
              v-if="!checkEmail"
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
            <app-button
              color="primary"
              square
              fullWidth
              @click="acceptResetPass"
              class="mb-3 mt-4"
              :disabled="disabledBtnForgot"
            >Xác nhận</app-button>
            <a
              v-if="!checkEmail"
              @click="sendOTP"
              :class="countDown === 0 ? '' : 'disable'"
              class="btn-send-otp"
        >Gửi lại mã xác thực ({{countDown}}s)</a>-->
        <!-- </div> -->
        <!-- </div> -->
      </div>
      <div class="col-md-6 text-center">
        <ImageAuth />
      </div>
    </div>
  </div>
</template>

<script>
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";
import {
  createResetPassWithPhone,
  createResetPassWithEmail
} from "~/models/auth/Forgot";
import { formatPhoneNumber, validatePassword } from "~/utils/validations";
import { ERRORS } from "~/utils/error-code";
import firebase from "@/services/firebase/FirebaseInit";
import ChangePassEmail from "~/components/page/auth/forgot/ChangePassEmail";
import ChangePassPhone from "~/components/page/auth/forgot/ChangePassPhone";
import ImageAuth from "~/components/page/auth/ImageAuth";
export default {
  components: {
    ChangePassEmail,
    ChangePassPhone,
    ImageAuth
  },

  data() {
    return {};
  },
  async asyncData({ store, query }) {
    return { checkEmail: query.email ? true : false };
  },

  async mounted() {
    await this.$recaptcha.init();

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
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth.scss";
</style>