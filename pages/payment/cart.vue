<template>
  <div class="container">
    <div class="row" v-if="get(cartCheckout, 'orders.length', 0)">
      <div class="col-md-8">
        <sub-block-section
          :title-cls="{'border-0': true }"
        >
          <template v-slot:title>
            <div class="d-flex align-items-center">
              <h4>Giỏ hàng</h4>
              <span class="text-gray ml-3">  ({{get(cartCheckout, 'orders.length', 0)}} sản phẩm)</span>
            </div>
          </template>
          <template v-slot:content>
            <div>
              <CartItem 
                class="mt-3"
                v-for="(item, index) in carts"
                :key="index"
                :item="item" 
              />
            </div>
          </template>
        </sub-block-section>
      </div>
      <div class="col-md-4">
        <CartSideRight :carts="carts" />
      </div>
    </div>
    <div v-else>
      <sub-block-section
        :title-cls="{'border-0': true }"
      >
        <template v-slot:title>
          <div class="d-flex align-items-center">
            <h4>Giỏ hàng</h4>
            <span class="text-gray ml-3">  (0 sản phẩm)</span>
          </div>
        </template>
         <template v-slot:content>
           <div class="text-center" style="margin:61px 0 43px">
             <ImageCartNull/>
             <p class="my-4">Không có sản phẩm nào trong giỏ hàng</p>
             <app-button square to="/elearning" nuxt>Tiếp tục mua sắm</app-button>
           </div>
         </template>
      </sub-block-section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import CartSideRight from "~/components/page/payment/CartSideRight";
import CartItem from "~/components/page/payment/CartItem";
import { get } from "lodash";
import ImageCartNull from "~/assets/svg/images/shopping-cart-null.svg?inline"

export default {
  name: "ShoppingCart",

  components: {
    CartSideRight,
    CartItem,
    ImageCartNull
  },
  methods: {
    ...mapActions("cart", ["cartList"]),
    get
  },

  computed: {
    ...mapGetters("cart", ["cartCheckout"]),
    ...mapState(`cart`, { carts: "carts" }),
  },

  created() {
    console.log(this.carts);
  },

  mounted() {
    this.cartList();
  },
};
</script>

<style></style>
