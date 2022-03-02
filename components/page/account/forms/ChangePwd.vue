<template>
  <sub-block-section :has-title="false">
    <template v-slot:content>
      <div class="form--normal" style="margin-bottom: 15.5rem;">
        <div class="row">
          <div class="col-md-3">
            <label for class="form--normal__title">Mật khẩu cũ</label>
          </div>
          <div class="col-md-9">
            <app-input
              v-model="oldPassword"
              type="password"
              :validate="validateProps.oldPassword"
              :error="$v.oldPassword.$invalid || validate.oldPassword"
              :message="errorMessage.oldPassword"
              autocomplete="new-password"
              @input="handleOldPassword"
              placeholder="Nhập mât khẩu cũ"
            />
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Mật khẩu mới</label>
          </div>
          <div class="col-md-9">
            <app-input
              v-model="newPassword"
              type="password"
              :error="$v.newPassword.$invalid || validate.newPassword"
              :message="errorMessage.newPassword"
              :validate="validateProps.newPassword"
              @input="handleNewPassword"
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Xác nhận mật khẩu</label>
          </div>
          <div class="col-md-9">
            <app-input
              v-model="coNewPassword"
              type="password"
              :error="$v.coNewPassword.$invalid || validate.coNewPassword"
              :message="errorMessage.coNewPassword"
              :validate="validateProps.coNewPassword"
              @input="handleCoNewPassword"
              placeholder="Xác nhận mật khẩu mới"
            />
          </div>
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <app-button @click="save" :disabled="disabledBtn" size="lg">Thay đổi mật khẩu</app-button>
          </div>
        </div>
      </div>
    </template>
  </sub-block-section>
</template>

<script>
import IconTick from "~/assets/svg/icons/tick.svg?inline";
import { mapState, mapActions } from "vuex";
import { ERRORS } from "~/utils/error-code";
import {
  required,
  minLength,
  sameAs,
  maxLength
} from "vuelidate/lib/validators";
import { validatePassword } from "~/utils/validations";

export default {
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      coNewPassword: "",
      error: false,
      error2: false,
      error3: false,
      success: false,
      errorMessage: {
        oldPassword: "",
        newPassword: "",
        coNewPassword: ""
      },
      validateProps: { oldPassword: "", newPassword: "", coNewPassword: "" },
      validate: { oldPassword: true, newPassword: true }
    };
  },
  validations: {
    oldPassword: { required },
    newPassword: { required },
    coNewPassword: { required, sameAsPassword: sameAs("newPassword") }
  },
  computed: {
    disabledBtn() {
      const btnDisabled =
        this.$v.$invalid ||
        this.validate.oldPassword ||
        this.validate.newPassword;
      return btnDisabled;
    }
  },
  methods: {
    ...mapActions("auth", ["changePassword"]),
    save() {
      const data = {
        current_pwd: this.oldPassword,
        new_pwd: this.newPassword,
        verify_new_pass: this.coNewPassword
      };
      const doAdd = this.changePassword(data).then(result => {
        if (result.success == 1) {
          this.success = true;
          this.$emit("success", true);
          // this.$emit("click-close");
        } else {
          this.showErrorWhenSave(result);
          // this.$toasted.error(result.message);
        }
      });
    },
    handleOldPassword(_password) {
      this.validate.oldPassword = true;
      this.validateProps.oldPassword = "";
      if (!this.$v.oldPassword.required) {
        this.validateProps.oldPassword = 2;
        this.errorMessage.oldPassword = "Trường này là bắt buộc";
      } else if (validatePassword(_password)) {
        this.validateProps.oldPassword = 1;
        this.validate.oldPassword = false;
        this.errorMessage.oldPassword = "";
      } else if (!validatePassword(_password)) {
        this.validateProps.oldPassword = 2;
        this.errorMessage.oldPassword =
          "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái in hoa, thường và 1 chữ số";
      }
    },
    handleNewPassword(_password) {
      this.validate.newPassword = true;
      this.validateProps.newPassword = "";
      if (!this.$v.newPassword.required) {
        this.validateProps.newPassword = 2;
        this.errorMessage.newPassword = "Trường này là bắt buộc";
      } else if (validatePassword(_password)) {
        this.validateProps.newPassword = 1;
        this.errorMessage.newPassword = "";
        this.validate.newPassword = false;
      } else if (!validatePassword(_password)) {
        this.validateProps.newPassword = 2;
        this.errorMessage.newPassword =
          "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái in hoa, thường và 1 chữ số";
      }
    },
    handleCoNewPassword() {
      if (!this.$v.coNewPassword.required) {
        this.validateProps.coNewPassword = 2;
        this.errorMessage.coNewPassword = "Trường này là bắt buộc";
      } else if (!this.$v.coNewPassword.sameAsPassword) {
        this.validateProps.coNewPassword = 2;
        this.errorMessage.coNewPassword = "Xác nhận mật khẩu không khớp";
      } else {
        this.validateProps.coNewPassword = 1;
        this.errorMessage.coNewPassword = "";
      }
    },
    reset() {
      const that = this;
      that.oldPassword = "";
      that.newPassword = "";
      that.coNewPassword = "";
      that.error = false;
      that.error2 = false;
      that.error3 = false;
      that.success = false;
    },
    showErrorWhenSave(error) {
      let message = "";
      switch (error.code) {
        case ERRORS.CHANGE_PWD.INVALID_CURREN_PASS:
          this.validateProps.oldPassword = 2;
          // this.errorMessage.oldPassword = "Trường này là bắt buộc";
          message = "Mật khẩu của bạn không đúng";
          break;
        // case ERRORS.REGISTER.PASSWORD_LEAST:
        //   message =
        //     "Invalid password. Password must at least 8 characters, include lowercase, uppercase and number";
        //   break;
        default:
          message = "Đã có lỗi xảy ra. Vui lòng thử lại sau";
          break;
      }
      this.$toasted.error(message);
    }
  },
  watch: {
    visible() {
      this.reset();
    }
  }
};
</script>

<style lang="scss">
</style>