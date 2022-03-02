<template>
  <div class="course-rates__top">
    <div class="row items-center">
      <div class="col-md-6 col-sm-12">
        <div class="text-center d-inline-block">
          <strong class="h1 color-primary">{{
            get(reviews, "averageRate", 0)
          }}</strong>
          <app-stars
            :stars="Math.floor(get(reviews, 'averageRate', 0))"
            :size="16"
            class="mt-2 mb-2"
          />
          <p class="color-999">
            ({{ get(reviews, "totalReview", 0) }} người đánh giá)
          </p>
        </div>
      </div>
      <div class="col-md-6 col-sm-12">
        <div class="chart-stars">
          <course-star-item
            v-for="(rate, index) in get(reviews, 'rates', [])"
            :rate="rate"
            :key="index"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconStar from "~/assets/svg/icons/star.svg?inline";
import IconStarO from "~/assets/svg/icons/star-o.svg?inline";
import CourseStarItem from "~/components/page/course/CourseStarItem";
import { get } from "lodash";

export default {
  components: {
    IconStar,
    IconStarO,
    CourseStarItem
  },

  props: {
    reviews: {
      type: Object,
      default: null
    }
  },

  methods: {
    get
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/_course-stars.scss";
</style>
