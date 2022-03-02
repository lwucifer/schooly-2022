<template>
  <app-modal
    centered
    :width="360"
    :component-class="{ 'auth-modal': true }"
    v-if="visible"
    :footer="false"
    title="Xác thực tài khoản"
    @close="close"
  >
    <!-- <div >
      <h3 class="color-primary">
        Xác thực tài khoản
      </h3>
    </div>-->
    <div slot="content">
      <div class="form-group_border-bottom">
        <app-input
          class="form-control ml-0 w-100"
          type="text"
          maxlength="6"
          placeholder="Nhập mã OTP"
          @input="hanldeOtp"
        />
      </div>
      <app-button
        color="primary"
        square
        fullWidth
        @click="acceptOtp"
        :disabled="disabledBtn"
      >Xác nhận</app-button>
      <p class="color-red text-center full-width mt-2" v-if="error">{{message}}</p>
    </div>
  </app-modal>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {
      valueInput: "",
      checkOtp: true,
    };
  },

  props: {
    visible: Boolean,
    error: Boolean,
    message: {
      type: String,
      required: false,
      default: "",
    },
  },
  computed: {
    disabledBtn() {
      return this.checkOtp;
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    acceptOtp() {
      this.$emit("submit", this.valueInput);
    },
    hanldeOtp(val) {
      this.valueInput = val;
      if (val && val.length == 6) {
        this.checkOtp = false;
      } else {
        this.checkOtp = true;
      }
      // this.valueInput = event.target.value;
      this.$emit("change", this.valueInput);
    },
  },
};
</script>
<style lang="scss">
.auth-modal .app-modal-title {
  color: $color-primary;
}
</style>