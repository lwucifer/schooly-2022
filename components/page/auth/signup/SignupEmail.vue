<template>
  <form @submit.prevent="registerEmail">
    <div class="auth_content mb-4">
      <app-input
        type="text"
        v-model="email"
        placeholder="Nhập email"
        :error="$v.email.$invalid"
        :message="errorMessage.email"
        :validate="validateProps.email"
        @input="handleEmail"
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
      color="primary"
      type="submit"
      square
      :loading="loading"
      fullWidth
      :disabled="disabledBtnRegister"
    >Đăng ký</app-button>
    <!-- <app-modal
      centered
      :width="450"
      :footer="false"
      :component-class="{ 'auth-modal': true }"
      v-if="modalConfirmEmail"
    >
      <h3 class="color-primary header-modal-success" slot="header">Đăng ký thành công</h3>

      <div slot="content">
        <p class="line-height-2">
          Tài khoản của bạn đã đăng ký thành công!
          <br />Vui lòng xác thực tài khoản qua email
          <br />
          <span class="color-primary">{{this.email}}</span>
        </p>
        <n-link
          :to="'/auth/signin'"
          class="color-white btn btn--size-md btn--full-width btn--color-primary btn--square"
        >Xác thực tài khoản</n-link>
      </div>
    </app-modal>-->
  </form>
</template>

<script>
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";
import { createSignupWithEmail } from "~/models/auth/Signup";
import { validatePassword } from "~/utils/validations";
import { ERRORS } from "~/utils/error-code";
import {
  required,
  email,
  minLength,
  maxLength,
  sameAs
} from "vuelidate/lib/validators";
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
      email: "",
      password: "",
      fullname: "",
      CfmPassword: "",
      error: "",
      modalConfirmEmail: false,
      errorMessage: {
        email: "",
        password: "",
        fullname: "",
        CfmPassword: ""
      },
      validateProps: { password: "", email: "", fullname: "", CfmPassword: "" },
      validate: { password: true },
      errorRespon: false,
      messageErrorRegister: "",
      loading: false
    };
  },
  validations: {
    email: { required, email },
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
    ...mapActions("auth", ["register"]),
    async registerEmail() {
      this.loading = true;
      try {
        const token = await this.$recaptcha.execute("register");
        console.log("ReCaptcha token:", token);
        const registerModel = createSignupWithEmail(
          this.email,
          this.password,
          this.fullname,
          token
        );
        const doAdd = this.register(registerModel).then(result => {
          if (result.success == true) {
            // this.modalConfirmEmail = true;
            this.loading = false;
            this.$router.push(`/auth/signup/email?email=${this.email}`);
          } else {
            this.showErrorWhenRegister(result);
            this.loading = false;
          }
        });
      } catch (error) {
        console.log("Login error:", error);
      }
    },
    handleEmail() {
      this.errorRespon = false;
      this.validateProps.email = "";
      if (!this.$v.email.required) {
        this.validateProps.email = 2;
        this.errorMessage.email = "Trường này là bắt buộc";
      } else if (!this.$v.email.email) {
        this.validateProps.email = 2;
        this.errorMessage.email = "Email không hợp lệ";
      } else {
        this.validateProps.email = 1;
        this.errorMessage.email = "";
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