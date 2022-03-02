<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div class="wrap-success-auth">
          <IconSuccess70px class="mb-3 fill-primary" />
          <h3 class="text-primary">Xác thực thành công</h3>
          <p class="my-4">Tài khoản của bạn đã được xác thực!</p>
          <app-button class="mt-2 btn-confirm" square :to="'/auth/signin'" nuxt>Đăng nhập ngay</app-button>
        </div>
      </div>
      <div class="col-md-6 text-center">
        <ImageAuth />
      </div>
    </div>
  </div>
</template>

<script>
import ImageAuth from "~/components/page/auth/ImageAuth";
import IconSuccess70px from '~/assets/svg/icons/success_70px.svg?inline';
export default {
  components: {
    ImageAuth,
    IconSuccess70px
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth-v2.scss";
</style>