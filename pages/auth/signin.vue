<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div class="wrap-form_auth">
          <div class="head-form_auth">
            <h2>Đăng nhập</h2>
            <!-- <div class="auth__nav-v2">
              <a :class="byEmail ? 'active' : ''" @click="tabEmail">Email</a>
              <a :class="byEmail ? '' : 'active'" @click="tabPhone">Số điện thoại</a>
            </div>-->
          </div>
          <div class="px-4">
            <SigninForm @signin="handleSigninSuccess" />
            <!-- <SigninEmail v-show="byEmail" @signin="handleSigninSuccess" />
            <SigninPhone v-show="!byEmail" @signin="handleSigninSuccess" />-->
          </div>
          <p class="title-either_auth">hoặc</p>
          <div class="text-dark">
            <p>Đăng nhập nhanh với</p>
            <div class="mt-3 mb-15">
              <app-button tag="a" class="btn-social btn-facebook" :href="fbLoginUrl">
                <IconFacebook class="mr-2" />Facebook
              </app-button>
              <app-button tag="a" class="btn-social btn-google" :href="ggLoginUrl">
                <IconGoogle class="mr-2" />Google
              </app-button>
            </div>
            <div class="mb-4">
              <span>Chưa có tài khoản?</span>
              <n-link :to="'/auth/signup'" class="bnt-auth">Đăng ký</n-link>
            </div>
          </div>
          <n-link :to="'/auth/forgot'" class="text-dark text-decoration-none mb-4">Quên mật khẩu?</n-link>
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
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { getDeviceID } from "~/utils/common";

import {
  createSigninWithPhone,
  createSigninWithEmail,
} from "~/models/auth/Signin";
import SigninEmail from "~/components/page/auth/signin/SigninEmail";
import SigninPhone from "~/components/page/auth/signin/SigninPhone";
import SigninForm from "~/components/page/auth/signin/SigninForm";
import * as constants from "~/utils/constants";
import { setFirebaseToken } from "~/utils/auth";

import IconFacebook from "~/assets/svg/icons/facebook.svg?inline";
import IconGoogle from "~/assets/svg/icons/google.svg?inline";
import ImageAuth from "~/components/page/auth/ImageAuth";
import { createRegisterDeviceModel } from "../../models/notifications/RegisterDevice";

export default {
  middleware: "auth",
  components: {
    SigninEmail,
    SigninPhone,
    SigninForm,
    IconFacebook,
    IconGoogle,
    ImageAuth,
  },

  data() {
    return {
      phone: "",
      email: "",
      password: "",
      error: false,
      byEmail: true,
      prevRoute: null,
    };
  },

  beforeRouteEnter(to, from, next) {
    console.log("[beforeRouteEnter]", { to, from, next });
    next((vm) => {
      vm.prevRoute = from.path;
    });
  },

  async mounted() {
    await this.$recaptcha.init();

    // check whether device_id is set or not?
    const isDeviceIdExist = !!getDeviceID();
    !isDeviceIdExist && this.initFingerPrint();
  },

  computed: {
    ...mapGetters("auth", ["userId"]),

    fbLoginUrl() {
      return `https://www.facebook.com/dialog/oauth?client_id=${process.env.FB_CLIENT_ID}&scope=email&redirect_uri=${process.env.FB_REDIRECT_URI}`;
    },
    ggLoginUrl() {
      return `https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?scope=email&redirect_uri=${process.env.GG_REDIRECT_URI}&response_type=code&client_id=${process.env.GG_CLIENT_ID}&approval_prompt=force&flowName=GeneralOAuthFlow`;
    },
  },
  methods: {
    ...mapActions("auth", ["login"]),
    ...mapActions("notifications", ["registerDevice"]),

    handleSigninSuccess(isSuccess) {
      console.log("[handleSigninSuccess]", isSuccess);
      this.getFirebaseToken(this.registerDevice);
      // this.$router.go(-1); // back to previous
      if (!this.prevRoute || constants.PREV_ROUTE.includes(this.prevRoute)) {
        this.$router.push("/");
      } else if (this.prevRoute.includes("messages/t")) {
        this.$router.push("/messages/t");
      }
      // else if (this.prevRoute != `/${this.userId}/info`) {
      //   this.$router.push(`/${this.userId}/info`);
      // }
      else {
        this.$router.go(-1);
      }
    },

    tabPhone() {
      (this.byEmail = false), (this.password = "");
    },
    tabEmail() {
      (this.byEmail = true), (this.password = "");
    },

    initFingerPrint() {
      console.log("[initFingerPrint]", window.requestIdleCallback);
      if (window.requestIdleCallback) {
        requestIdleCallback(getDeviceID);
      } else {
        setTimeout(getDeviceID, 500);
      }
    },

    getFirebaseToken(callback) {
      console.log("[getFirebaseToken]");
      this.$fireMess
        .requestPermission()
        .then((granted) => {
          console.log("[Messaging] have permission", granted);
          return this.$fireMess.getToken();
        })
        .then((token) => {
          console.log("[Messaging] token", token);
          setFirebaseToken(token);

          // register notification here
          const deviceRegReq = createRegisterDeviceModel();
          callback(deviceRegReq);
        })
        .catch((err) => {
          console.log("[Messaging] Error occured ", err);
        });
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth-v2.scss";
</style>
