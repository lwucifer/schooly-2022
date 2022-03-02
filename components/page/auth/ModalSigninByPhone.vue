<template>
  <app-modal
    centered
    :width="306"
    :component-class="{ 'auth-modal': true }"
    @close="$router.push('/')"
    v-if="visible"
  >
    <h3 class="color-primary" slot="header">
      Đăng nhập
      <a class="btn-close" @click="$emit('click-close')">X</a>
    </h3>

    <div slot="content">
      <!--Step 3-->
      <div class="form-group_border-bottom" v-if="step === 3">
        <input type="text" v-model="otp" class="form-control ml-0" placeholder="Nhập mã OTP" />
      </div>
      <div class="form-group_border-bottom" v-if="step === 3">
        <IconLock width="13" height="23" />
        <input
          type="password"
          v-model="newpassword"
          class="form-control"
          placeholder="Mật khẩu mới"
        />
      </div>

      <!--Step 2-->
      <div class="form-group_border-bottom" v-if="step === 2">
        <IconLock width="13" height="23" />
        <input type="password" v-model="password" class="form-control" placeholder="Mật khẩu" />
      </div>

      <!--Step 1-->
      <div class="form-group_border-bottom" v-if="step === 1">
        <IconPhone width="11" height="28" />
        <app-select class="phone-select" :options="areaCodes" v-model="areaCode" />
        <input
          type="text"
          maxlength="20"
          v-model="phone"
          class="form-control"
          placeholder="Số điện thoại"
        />
      </div>
      <i class="danger" v-if="phoneError">Số điện thoại tối đa 10 ký tự</i>

      <app-button
        color="primary"
        square
        fullWidth
        @click="nextlogin"
      >{{ step === 1 ? 'Tiếp tục' : 'Đăng nhập' }}</app-button>
      <a class="color-primary" @click="forgot" v-if="step === 2">Quên mật khẩu?</a>
      <a
        class="color-primary"
        @click="resendOTP"
        v-if="step === 3"
        :class="countDown > 0 ? 'disabled' : ''"
      >
        Gửi lại mã xác thực
        <span>({{countDown}}s)</span>
      </a>
    </div>
  </app-modal>
</template>

<script>
import IconPhone from "~/assets/svg/icons/phone.svg?inline";
import IconLock from "~/assets/svg/icons/lock.svg?inline";
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    IconPhone,
    IconLock
  },
  props: {
    visible: Boolean
    //step: Number
  },
  computed: {},
  data() {
    return {
      step: 1,
      areaCodes: [
        { value: "+84", text: "+84" },
        { value: "+83", text: "+83" },
        { value: "+82", text: "+82" }
      ],
      areaCode: "+84",
      phone: "",
      otp: "",
      password: "",
      newpassword: "",
      countDownDefault: 120,
      countDown: 120,
      phoneError: false,
      timeout: ""
    };
  },
  methods: {
    ...mapActions("auth", ["login", "status", "forgotPassword"]),
    nextlogin() {
      const that = this;
      if (that.step === 2 && that.password && that.phone) {
        let data = {
          phone_number: that.phone,
          password: that.password,
          firebase_token: ""
        };
        const doAdd = that.login(data).then(result => {
          if (result.success == 1) {
            this.$emit("click-close");
          } else {
          }
        });
      } else if (that.step === 1) {
        if (that.phone.length > 10) {
          that.phoneError = true;
        } else {
          that.phoneError = false;
          that.step = that.phone ? 2 : 1;
          // that.status({ phone: that.phone });
        }
      } else {
        let data = {
          firebase_token: "",
          password: that.newpassword
        };
        const doAdd = that.forgotPassword(data).then(result => {
          if (result.success == 1) {
            this.$emit("click-close");
          } else {
          }
        });
      }
    },
    forgot() {
      const that = this;
      that.step = 3;
      that.sendOTP();
    },
    resendOTP() {
      const that = this;
      if (that.countDown === 0) {
        that.sendOTP();
      }
    },
    sendOTP() {
      const that = this;
      that.countDown = that.countDownDefault;
      clearTimeout(that.timeout);
      that.countDownTimer();
    },
    countDownTimer() {
      const that = this;
      if (that.countDown > 0) {
        that.timeout = setTimeout(() => {
          that.countDown -= 1;
          that.countDownTimer();
        }, 1000);
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth-modal.scss";
</style>