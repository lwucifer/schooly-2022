<template>
  <div class="container">
      <div class="wrap404page">
        <h1 class="mb-4">Trang không tồn tại</h1>

        <p class="wrap404page__title">Liên kết bạn truy cập có thể bị hỏng hoặc trang có thể đã bị xóa.</p>

        <div class="wrap404page__logo text-center">
          <Logo404/>
        </div>

        <app-button
          class="wrap404page__button-back" 
          size="md" 
          color="primary">
            <n-link to="/">
              <IconArrowLeft class="mr-2"/> Quay lại trang chủ
            </n-link>
        </app-button>
      </div>
  </div>
</template>

<script>
import IconArrowLeft  from "~/assets/svg/design-icons/arrow-left.svg?inline"
import Logo404 from "~/assets/svg/logo/logo-404.svg?inline"
export default {
    components:{
        Logo404,
        IconArrowLeft
    },
    name: 'error-404',
    props: {
      error: {
        type: Object,
        default: () => {},
      },
    },
}
</script>

<style lang="scss">
@import "~/assets/scss/pages/_page_404.scss";
</style>