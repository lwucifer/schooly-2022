<template>
  <div class="wrap-cart-item_payment">
    <span @click="handleClickCartItem(item)" style="cursor: pointer">
      <img :src="get(item, 'images.low', '')" />
    </span>
    <div class="ml-3">
      <h5 @click="handleClickCartItem(item)" style="cursor: pointer">
        {{ get(item, "elearning_name", "") }}
      </h5>
      <p class="my-2 text-gray">{{ get(item, "teacher_name", "") }}</p>
    </div>
    <div class="ml-auto">
      <h5 class="text-right text-primary">
        {{ numeral(get(item, "price", "")).format() }} đ
      </h5>
      <div class="d-flex mt-3" v-if="item.price != item.original_price">
        <h6 class="ml-2">
          -{{ numeral(get(item, "discount", "")).format("0,0.00") }}%
        </h6>
        <span class="price-cart_payment"
          >{{ numeral(get(item, "original_price", "")).format() }}đ</span
        >
      </div>
      <p class="btn-delete_cart-item">
        <a @click.prevent="deleteCartItem">Xoá khỏi giỏ hàng</a>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { get } from "lodash";
import { getDeviceID } from "~/utils/common";
import numeral from "numeral";

export default {
  name: "CartItem",

  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },

  updated() {
    console.log(this.item);
  },

  methods: {
    ...mapActions("cart", ["cartDelete"]),
    ...mapActions("cart", ["cartList"]),
    get,
    numeral,

    handleClickCartItem(item) {
      const elearning_id = get(item, "elearning_id", "");
      this.$router.push(`/elearning/${elearning_id}`);
    },

    deleteCartItem() {
      const payload = {
        product: get(this, "item.product", ""),
        product_id: get(this, "item.product_id", ""),
      };
      console.log(payload,'hello')
      // const product_id = get(this, "item.product_id", "");
      this.cartDelete(payload).then((res) => {
        if (get(res, "success", false)) {
          this.$toasted.success(get(res, "message", "Thành công"));
          this.cartList();
          return;
        }
        this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
      });
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/payment/_payment.scss";
</style>
