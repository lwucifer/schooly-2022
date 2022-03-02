<template>
  <div class="auth__main">
    <h3 class="text-primary">Thay đổi mật khẩu</h3>
    <div class="auth_content mt-5">
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
        style="width:293px;height:41px"
        @click="acceptResetPass"
        class="mb-3 mt-4"
        :disabled="disabledBtnForgot"
      >Xác nhận</app-button>
    </div>
  </div>
</template>

<script>
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";
import { createResetPassWithEmail } from "~/models/auth/Forgot";
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
      password: "",
      coPassword: "",
      email: "",
      verify_token: "",
      queryEmail: false,
      code: "",
      errorMessage: {
        password: "",
        coPassword: ""
      },
      validateProps: { password: "", coPassword: "" },
      validate: { password: true },
      errorRespon: false,
      messageErrorChange: ""
    };
  },
  validations: {
    password: { required },
    coPassword: { required, sameAsPassword: sameAs("password") }
  },

  mounted() {
    this.email = this.$route.query.email ? this.$route.query.email : "";
    this.code = this.$route.query.code ? this.$route.query.code : "";
  },

  computed: {
    disabledBtnForgot() {
      const btnDisabled = this.$v.$invalid || this.validate.password;
      return btnDisabled;
    }
  },

  methods: {
    ...mapActions("auth", ["forgotPassword"]),
    async acceptResetPass() {
      try {
        const token = await this.$recaptcha.execute("resetpass");
        console.log("ReCaptcha token:", token);
        const resetPassModelEmail = createResetPassWithEmail(
          this.email,
          this.code,
          this.password,
          token
        );
        const doAdd = this.forgotPassword(resetPassModelEmail).then(result => {
          if (result.success == true) {
            this.$router.push("/auth/forgot/success");
          } else {
            this.showErrorChangePass(result);
          }
        });
      } catch (error) {
        console.log("Login error:", error);
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
    handleCoPassword() {
      this.errorRespon = false;
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
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth.scss";
</style>