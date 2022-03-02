<template>
  <div
    class="course-item-2"
    :class="{ 'course-item-2--size-sm': this.size === 'sm' }"
  >
    <!-- <div class="course-item-2__overlay" v-if="!get(item, 'is_hidden', true)"></div> -->
    <div class="course-item-2__img">
      <n-link :to="`/elearning/${id}`">
        <img
          v-lazy="get(item, 'avatar.low', '')"
          :alt="get(item, 'name', '')"
          class="d-block w-100"
        />

        <div
          v-if="get(item, 'is_streaming', false)"
          class="course-item-2__livestream"
        >
          <IconCameraOnline class="icon" />Trực tiếp
        </div>

        <div
          v-if="get(item, 'is_streaming', false)"
          class="course-item-2__online-class"
        >
          Lớp học đang diễn ra
        </div>

        <!-- nếu giảm giá 100% thì sẽ ko hiện nữa -->
        <div
          v-if="price.discount && price.price"
          class="course-item-2__discount"
        >
          -{{ parseInt(price.discount) }}%
        </div>
      </n-link>

      <!-- <div class="video" v-if="get(item, 'video', '')">
        <IconVideo3 />
      </div>-->
    </div>

    <div class="course-item-2__bottom">
      <h3 class="course-item-2__name">
        <n-link class="title" :to="`/elearning/${id}`" :title="item.name">{{
          item.name
        }}</n-link>
      </h3>

      <div class="course-item-2__teacher">
        <n-link
          :to="`/public/profile/teacher?user_id=${get(item, 'teacher.id', '')}`"
          class="profile-link"
        >
          <app-avatar
            :src="get(item, 'teacher.avatar.low', '')"
            :size="size === 'sm' ? 22 : 24"
          />
          <span>{{ get(item, "teacher.name", "") }}</span>
        </n-link>
        <!--<app-avatar :src="get(teacher, 'avatar.low', '')" :size="size === 'sm' ? 22 : 24" />-->
        <!--<span>{{ get(teacher, 'name', '') }}</span>-->
      </div>

      <div class="course-item-2__rating">
        <app-stars
          class="d-inline-flex"
          :stars="get(item, 'voting.rate', 0)"
          :size="size === 'sm' ? 12 : 14"
        />
        <span class="text-dark">
          <strong>{{ get(item, "voting.rate", 0) | numeralFormat("0.0") }}</strong>
          ({{ get(item, "voting.votes", 0) }})
        </span>
        <slot name="mycoursefavourite"></slot>
      </div>

      <div class="course-item-2__price-wrapper">
        <b v-if="price.price == 0 || price.price.price == 0" class="text-primary body-1 font-weight-bold"
          >Miễn phí</b
        >

        <template v-else>
          <s class="body-3" v-if="price.discount">
            {{ get(price, "original_price") | numeralFormat }}đ
          </s>
          <b class="text-primary body-1 font-weight-bold ml-2"
            >{{ get(price, "price") | numeralFormat }}đ</b
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { assignIn, get, parseInt } from "lodash";
import numeral from "numeral";

// import IconVideo3 from "~/assets/svg/icons/video3.svg?inline";
import IconCameraOnline from "assets/svg/icons/camera-online.svg?inline";

export default {
  components: {
    // IconVideo3,
    IconCameraOnline,
  },

  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md"].includes(value),
    },
  },

  computed: {
    price() {
      if (this.item.elearning_price) return this.item.elearning_price;
      return {
        discount: get(this.item.price && this.item.price.price ? this.item.price : this.item, "discount", 0),
        original_price: get(this.item.price && this.item.price.price ? this.item.price : this.item, "original_price", 0),
        price: get(this.item.price && this.item.price.price ? this.item.price : this.item, "price", 0),
      };
    },

    id() {
      return this.item.elearning_id || this.item.id;
    },
  },

  methods: {
    get,
    numeral,
    parseInt
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/_course-item-2.scss";
</style>
