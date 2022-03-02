<template>
  <app-modal
    centered
    :component-class="{ 'account-link-school-modal': true }"
    v-if="visible"
    :header="false"
    :footer="false"
  >
    <div slot="content" class="py-4 px-3 text-center">
      <div>
        <h3 class="account-link-school-modal__title">Nhập mã liên kết</h3>
        <app-input
          v-model="code"
          placeholder="Nhập mã liên kết trường học"
          :validate="isValidCode"
          :message="messageCode"
        />
        <div class="account-link-school-modal__actions">
          <app-button
            class="font-weight-semi-bold mr-3"
            color="default"
            outline
            @click="$emit('cancel')"
          >
            <span>Hủy</span>
          </app-button>
          <app-button
            class="font-weight-semi-bold"
            color="primary"
            @click.prevent="$emit('ok', code)"
          >
            <span>Xác nhận</span>
          </app-button>
        </div>
      </div>
      <button class="account-link-school-modal__close" @click="$emit('close')">
        <IconClose class="icon d-block fill-opacity-1" />
      </button>
    </div>
  </app-modal>
</template>

<script>
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import { APP_INPUT_VALIDATE_STATUS as VALIDATE_STATUS } from "~/utils/constants";

export default {
  components: {
    IconClose
  },
  data() {
    return {
      code: "",
      success: false,
      messageCode: ""
    };
  },
  props: {
    visible: Boolean
  },
  computed: {
    isValidCode() {
      if (this.code && this.code.length == 9) {
        this.messageCode = "";
        return VALIDATE_STATUS.SUCCESS;
      } else if (this.code) {
        this.messageCode = "Mã liên kết không hợp lệ";
        return VALIDATE_STATUS.ERROR;
      } else {
        this.messageCode = "";
      }
    }
  },

  methods: {}
};
</script>

<style lang="scss">
@import "~/assets/scss/components/account/_account-link-school-modal.scss";
</style>