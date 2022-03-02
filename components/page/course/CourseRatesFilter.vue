<template>
  <div class="course-rates__nav">
    <app-button
      square
      normal
      :color="active == 0 ? 'primary' : 'gray'"
      @click="handleClick({ rate: '' })"
      >Tất cả
    </app-button>

    <course-rates-filter-item
      v-for="(rate, index) in rates"
      :key="index"
      :rate="rate"
      :color="active == get(rate, 'rate', 0) ? 'primary' : 'gray'"
      @handleClick="handleClick"
    />
  </div>
</template>

<script>
import CourseStars from "~/components/page/course/CourseStars";
import CourseRateComment from "~/components/page/course/CourseRateComment";
import CourseRatesFilterItem from "~/components/page/course/CourseRatesFilterItem";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { useEffect } from "~/utils/common";
import { mapState } from "vuex";

export default {
  components: {
    CourseStars,
    CourseRateComment,
    CourseRatesFilterItem
  },

  props: {
    rates: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      active: 0
    };
  },

  methods: {
    get,
    handleClick(rate) {
      this.active = get(rate, "rate", 0);
      this.$emit("handleFilterRate", rate);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/_course-rates.scss";
</style>
