<template>
  <div class="modal_payment" v-if="fail">
    <button class="btn-close-modal" @click.prevent="$emit('close-modal')">
      <IconClose2 />
    </button>
    <div class="d-flex align-items-center payment-text">
      <IconCloseOutline class="mr-2 fill-secondary" />
      <span>Thêm vào giỏ hàng thất bại</span>
    </div>
    <app-button
      class="mt-4 btn-view-cart"
      @click.prevent="$router.push('/elearning')"
      >Tiếp tục mua sắm</app-button
    >
  </div>

  <div class="modal_payment" v-else>
    <button class="btn-close-modal" @click.prevent="$emit('close-modal')">
      <IconClose2 />
    </button>
    <div class="d-flex align-items-center payment-text">
      <IconCheckCircle24px class="mr-2 fill-primary" />
      <span>Thêm giỏ hàng thành công</span>
    </div>
    <app-button
      class="mt-4 btn-view-cart"
      @click.prevent="$router.push('/payment/cart')"
      >Xem giỏ hàng và thanh toán</app-button
    >
  </div>
</template>

<script>
import IconCheckCircle24px from '~/assets/svg/v2-icons/check_circle_24px.svg?inline';
import IconCloseOutline from '~/assets/svg/icons/Close-outline.svg?inline';
import IconClose2 from "~/assets/svg/icons/close2.svg?inline";

export default {
  components: {
    IconCheckCircle24px,
    IconCloseOutline,
    IconClose2,
  },
  props: {
    fail: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/payment/_payment-modal.scss";
</style>
