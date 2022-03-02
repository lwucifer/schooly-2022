<template>
  <div class="wrap-payment-side">
      <app-button square color="secondary" class="btn-payment-side"
      >THANH TOÁN NGAY</app-button>
      <div class="my-4 d-flex align-items-center">
          <span>Thông tin đơn hàng (2 sản phẩm)</span>
          <app-button square size="sm" color="white" class="ml-auto">Sửa</app-button>
      </div>
      <hr>
      <div class="mt-3" v-for="index in 2" :key="index">
          <div class="d-flex">
              <span class="text-primary">Khóa học đại số 11</span>
              <span class="ml-auto">150.000đ</span>
          </div>
          <div class="mt-1">
              <span>Cung cấp bởi <strong>Trần Văn Nam</strong> </span>
          </div>
          <hr class="mt-3">
      </div>
      <div class="d-flex mt-4">
          <h5>Tổng tiền</h5>
          <h5 class="text-secondary ml-auto">196.000đ</h5>
      </div>

  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.wrap-payment-side{
    background: white;
    padding: 20px;
    .btn-payment-side{
        width: 100%;
    }
}
</style>