<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6" v-if="activeAccount">
        <div class="wrap-success-auth">
          <IconSuccess class="mb-3 fill-primary" />
          <h3 class="text-primary">Xác thực thành công</h3>
          <p class="my-4">Tài khoản của bạn đã được xác thực!</p>
          <app-button class="mt-2 btn-confirm" square :to="'/auth/signin'" nuxt>Đăng nhập ngay</app-button>
        </div>
      </div>
      <div class="col-md-6" v-else>
        <div class="wrap-success-auth">
          <IconWarning class="mb-3 fill-error" width="32" height="32" />
          <h3 class="text-error">Xác thực không thành công</h3>
          <p class="my-4">Bạn vui lòng xác thực lại!</p>
          <!--<app-button class="mt-2 btn-confirm" square :to="'/auth/signin'" nuxt>Đăng nhập ngay</app-button>-->
        </div>
      </div>
      <div class="col-md-6 text-center">
        <ImageAuth />
      </div>
    </div>
  </div>
</template>

<script>
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";
import ImageAuth from "~/components/page/auth/ImageAuth";
import IconSuccess from "~/assets/svg/icons/success.svg?inline";
import IconWarning from "~/assets/svg/icons/warning.svg?inline";
export default {
  components: {
    ImageAuth,
    IconSuccess,
    IconWarning
  },

  data() {
    return {};
  },
  async asyncData({ store, query }) {
    const action = await store.dispatch("auth/verifyEmail", {
      email: query.email ? query.email : "",
      code: query.code ? query.code : ""
    });

    return {
      activeAccount: action.success ? true : false
    };
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth-v2.scss";
</style>