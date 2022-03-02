<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div class="wrap-success-auth px-4">
          <IconSuccess70px class="mb-3 fill-primary" />
          <h3>Đăng ký thành công</h3>
          <p class="my-4 mx-5">
            Cảm ơn bạn đã tạo tài khoản Schoolly. Để hoàn tất việc đăng ký, vui lòng xác thực tài khoản qua email
          <a>{{email}}</a>
          </p>
          <app-button
            class="mt-2 btn-confirm"
            square
            :to="'/auth/signin'"
            nuxt
          >Xác thực tài khoản</app-button>
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
  },
  data() {
    return {
      email: ""
    };
  },
  mounted() {
    this.email = this.$route.query.email ? this.$route.query.email : "";
    console.log("huydv email", this.email);
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth-v2.scss";
</style>