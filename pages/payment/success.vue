<template>
  <div class="wrap-success_payment">
      <IconCheckCircle1 class="mt-2"/>
      <h3 class="my-4">Thanh toán thành công!</h3>
      <app-button style="width:155px;"  class="mb-4" nuxt to="/elearning/mycourses">Góc học tập</app-button>
      <div>
          <n-link class="text-decoration-none mt-3" to="/elearning">Tiếp tục mua sắm</n-link>
      </div>
      <div>
          <PaymentSuccessFooter class="mt-5"/>
      </div>
  </div>
</template>

<script>
import IconCheckCircle1 from '~/assets/svg/icons/check-circle-1.svg?inline';
import PaymentSuccessFooter from '~/components/page/payment/PaymenSuccessFooter';
export default {
    components:{
        IconCheckCircle1,
        PaymentSuccessFooter
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/payment/_payment.scss";
</style>