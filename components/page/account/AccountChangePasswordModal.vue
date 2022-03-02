<template>
  <app-modal centered :width="670" :component-class="{ 'account-edit-modal': true }" v-if="visible">
    <div slot="content">
      <div v-if="success" class="change-pass-success text-center">
        <h2 class="color-primary">Thành công</h2>
        <div class="icon-tick mt-3 mb-3">
          <IconTick />
        </div>
        <p>Chúc mừng bạn đã thay đổi mật khẩu thành công</p>
        <div class="text-center mt-4">
          <app-button size="lg" color="info" square @click="$emit('click-close')">Đóng</app-button>
        </div>
      </div>

      <div v-else class="account-form-change-pass">
        <h3>Thay đổi mật khẩu</h3>
        <app-input
          v-model="oldPassword"
          label="Mật khẩu hiện tại"
          type="password"
          :validate="validateProps.oldPassword"
          :error="$v.oldPassword.$invalid || validate.oldPassword"
          :message="errorMessage.oldPassword"
          autocomplete="new-password"
          @input="handleOldPassword"
        />
        <app-input
          v-model="newPassword"
          label="Mật khẩu mới"
          type="password"
          :error="$v.newPassword.$invalid || validate.newPassword"
          :message="errorMessage.newPassword"
          :validate="validateProps.newPassword"
          @input="handleNewPassword"
        />
        <app-input
          v-model="coNewPassword"
          label="Xác nhận mật khẩu"
          type="password"
          :error="$v.coNewPassword.$invalid || validate.coNewPassword"
          :message="errorMessage.coNewPassword"
          :validate="validateProps.coNewPassword"
          @input="handleCoNewPassword"
        />
        <div class="text-center">
          <app-button
            size="lg"
            color="info"
            class="mr-3"
            square
            @click="$emit('click-close')"
          >Hủy bỏ</app-button>
          <app-button size="xl" square @click="save()" :disabled="disabledBtn">Xác nhận</app-button>
        </div>
      </div>
    </div>
  </app-modal>
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
  components: {
    IconTick
  },
  props: {
    visible: Boolean,
    /*
    account: {
      type: Object,
      required: true,
      default: () => {}
    }
    */
  },
  computed: {},
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
      let data = {
        current_pwd: this.oldPassword,
        new_pwd: this.newPassword,
        verify_new_pass: this.coNewPassword
      };
      const doAdd = this.changePassword(data).then(result => {
        if (result.success == 1) {
          this.success = true;
          // this.$emit("click-close");
        } else {
          this.$toasted.error(result.message)
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
@import "~/assets/scss/components/account/_account-edit-modal.scss";
</style>