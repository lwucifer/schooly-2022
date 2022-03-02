<template>
  <div class="container">
      <div class="row">
        <div class="col-md-6">
            <div class="wrap-success-auth px-5">
                <IconSuccess70px class="mb-3 fill-primary"/>
                <h3>Gửi yêu cầu thành công</h3>
                <p class="my-4 mx-5">Vui lòng kiểm tra email của bạn để xác thực việc thay đổi mật khẩu.</p>
                <app-button class="mt-2 btn-confirm" square 
                            :to="'/auth/signin'"
                            nuxt
                >
                Trở về trang chủ
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