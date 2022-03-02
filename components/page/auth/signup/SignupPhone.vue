<template>
  <form @submit.prevent="hanldeShowModalOTP">
    <div class="auth_content mb-4">
      <app-input
        type="text"
        v-model="phone"
        placeholder="Nhập số điện thoại"
        maxlength="11"
        :error="$v.phone.$invalid"
        :message="errorMessage.phone"
        :validate="validateProps.phone"
        :onlyNumber="true"
        @input="handlePhone"
      >
        <template v-slot:prepend-inner>
          <div class="icon-inner-input">
            <IconPhoneIphone24px />
          </div>
        </template>
      </app-input>
      <app-input
        type="password"
        v-model="password"
        placeholder="Nhập mật khẩu"
        :error="$v.password.$invalid || validate.password"
        :message="errorMessage.password"
        :validate="validateProps.password"
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
        :error="$v.CfmPassword.$invalid"
        :message="errorMessage.CfmPassword"
        :validate="validateProps.CfmPassword"
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
        :error="$v.fullname.$invalid"
        :message="errorMessage.fullname"
        :validate="validateProps.fullname"
        @input="handleFullname"
      >
        <template v-slot:prepend-inner>
          <div class="icon-inner-input">
            <IconPerson24px />
          </div>
        </template>
      </app-input>
      <p class="color-red text-center full-width" v-if="errorRespon">{{messageErrorRegister}}</p>
    </div>
    <app-button
      :loading="loading"
      color="primary"
      square
      fullWidth
      :disabled="disabledBtnRegister"
      type="submit"
    >Đăng ký</app-button>
    <!-- <app-modal-otp
      :visible="modalOtp.showModalOTP"
      :error="modalOtp.errorOtp"
      :message="modalOtp.messageErrorOtp"
      @submit="submitOtp"
      @change="hanldeOtp"
      @close="closeModalOtp"
    />-->
    <app-modal-notify
      v-if="notify.showNotify"
      :title="notify.message"
      @close="closeNotify"
      @ok="$router.push(notify.redirectLink)"
    />
  </form>
</template>

<script>
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions, mapMutations } from "vuex";
import { createSignupWithPhone } from "~/models/auth/Signup";
import { formatPhoneNumber, validatePassword } from "~/utils/validations";
import { ERRORS } from "~/utils/error-code";
import {
  required,
  minLength,
  maxLength,
  sameAs
} from "vuelidate/lib/validators";
import IconPhoneIphone24px from "~/assets/svg/v2-icons/phone_iphone_24px.svg?inline";
import IconLock24px from "~/assets/svg/v2-icons/lock_24px.svg?inline";
import IconPerson24px from "~/assets/svg/v2-icons/person_24px.svg?inline";
export default {
  components: {
    IconPhoneIphone24px,
    IconLock24px,
    IconPerson24px
  },
  data() {
    return {
      phone: "",
      password: "",
      fullname: "",
      CfmPassword: "",
      error: "",
      otp: "",
      modalOtp: {
        showModalOTP: false,
        errorOtp: false,
        messageErrorOtp: ""
      },
      errorMessage: {
        phone: "",
        password: "",
        fullname: "",
        CfmPassword: ""
      },
      validateProps: { password: "", phone: "", fullname: "", CfmPassword: "" },
      validate: { password: true },
      errorRespon: false,
      messageErrorRegister: "",
      notify: {
        redirectLink: "",
        message: "",
        showNotify: false
      },
      loading: false
    };
  },
  validations: {
    phone: { required, minLength: minLength(10) },
    password: { required },
    fullname: { required, minLength: minLength(2), maxLength: maxLength(32) },
    CfmPassword: { required, sameAsPassword: sameAs("password") }
  },
  computed: {
    disabledBtnRegister() {
      const btnDisabled = this.$v.$invalid || this.validate.password;
      return btnDisabled;
    }
  },
  methods: {
    ...mapActions("auth", ["register", "sendotp", "status", "verifiOtp"]),
    ...mapMutations("auth", ["savePhonePass"]),
    async submitRegister() {
      try {
        const token = await this.$recaptcha.execute("register");
        console.log("ReCaptcha token:", token);
        const registerModel = createSignupWithPhone(
          `+${formatPhoneNumber(this.phone)}`,
          this.password,
          this.fullname,
          token,
          this.verify_token
        );
        const doAdd = this.register(registerModel).then(result => {
          if (result.success == true) {
            this.loading = false;
            this.notify = {
              redirectLink: "/auth/signin",
              message: "Đăng kí tài khoản thành công",
              showNotify: true
            };
          } else {
            this.showErrorWhenRegister(result);
            this.loading = false;
          }
        });
      } catch (error) {
        console.log("Login error:", error);
        this.loading = false;
      }
    },
    async hanldeShowModalOTP() {
      this.loading = true;
      if (this.phone != "" && this.password != "" && this.fullname != "") {
        const tokenCheckPhone = await this.$recaptcha.execute("status");
        const dataChecKPhone = {
          phone: `+${formatPhoneNumber(this.phone)}`,
          g_recaptcha_response: tokenCheckPhone
        };
        const doAdd = this.status(dataChecKPhone).then(result => {
          if (result.data == false) {
            const data = {
              phone: `+${formatPhoneNumber(this.phone)}`,
              appVerifier: window.recaptchaVerifier
            };
            this.sendotp(data).then(result => {
              if (!result.code) {
                this.loading = false;
                this.savePhonePass({
                  phone: this.phone,
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
      }
    },
    handlePhone() {
      this.errorRespon = false;
      this.phone = this.phone.replace(/\D/g, "");
      this.validateProps.phone = "";
      if (!this.$v.phone.required) {
        this.validateProps.phone = 2;
        this.errorMessage.phone = "Trường này là bắt buộc";
      } else if (!this.$v.phone.minLength) {
        this.validateProps.phone = 2;
        this.errorMessage.phone = "Số bạn nhập không phải là số điện thoại";
      } else {
        this.validateProps.phone = 1;
        this.errorMessage.phone = "";
      }
    },
    handlePassword(_password) {
      this.errorRespon = false;
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
    handleCfmPassword() {
      this.errorRespon = false;
      this.validate.CfmPassword = true;
      this.validateProps.CfmPassword = "";
      if (!this.$v.CfmPassword.required) {
        this.validateProps.CfmPassword = 2;
        this.errorMessage.CfmPassword = "Trường này là bắt buộc";
      } else if (!this.$v.CfmPassword.sameAsPassword) {
        this.validateProps.CfmPassword = 2;
        this.errorMessage.CfmPassword = "Mật khẩu không khớp nhau";
      } else {
        this.validateProps.CfmPassword = 1;
        this.errorMessage.CfmPassword = "";
      }
    },
    handleFullname() {
      this.errorRespon = false;
      this.validateProps.fullname = "";
      if (!this.$v.fullname.required) {
        this.validateProps.fullname = 2;
        this.errorMessage.fullname = "Trường này là bắt buộc";
      } else if (!this.$v.fullname.minLength) {
        this.validateProps.fullname = 2;
        this.errorMessage.fullname =
          "Họ và tên phải có ít nhất 2 ký tự và nhiều nhất là 32 ký tự";
      } else if (!this.$v.fullname.maxLength) {
        this.validateProps.fullname = 2;
        this.errorMessage.fullname =
          "Họ và tên phải có ít nhất 2 ký tự và nhiều nhất là 32 ký tự";
      } else {
        this.validateProps.fullname = 1;
        this.errorMessage.fullname = "";
      }
    },
    hanldeOtp() {
      this.modalOtp.errorOtp = false;
      this.modalOtp.messageErrorOtp = "";
    },
    closeModalOtp() {
      this.modalOtp.showModalOTP = false;
      this.otp = "";
      this.modalOtp.messageErrorOtp = "";
    },
    closeNotify() {
      this.notify.showNotify = false;
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

<style lang="scss">
</style>