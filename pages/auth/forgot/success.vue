<template>
  <div class="container">
      <div class="row">
        <div class="col-md-6">
            <div class="wrap-success-auth">
                <IconSuccess70px class="mb-3 fill-primary"/>
                <h3 class="text-primary">Đổi mật khẩu thành công</h3>
                <p class="my-4 mx-5">Tài khoản của bạn đã được cập nhật mật khẩu mới!</p>
                <app-button class="mt-2" square 
                            :to="'/auth/signin'"
                            style="width:293px;height:41px"
                            nuxt
                >
                Đăng nhập ngay
                </app-button>
            </div>
        </div>
        <div class="col-md-6 text-center">
            <ImageAuth/>
        </div>
    </div>
  </div>
</template>

<script>
import ImageAuth  from "~/components/page/auth/ImageAuth";
import IconSuccess70px from '~/assets/svg/icons/success_70px.svg?inline';
export default {
    components:{
        ImageAuth,
        IconSuccess70px
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/auth/_auth-v2.scss";
</style>