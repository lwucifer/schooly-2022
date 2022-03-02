<template>
  <div class="course-rates__commnents">
    <course-rate-comment
      :review="review"
      v-for="(review, index) in reviews"
      :key="index"
    />
    <app-pagination
      :pagination="page"
      @pagechange="onPageChange"
      class="mt-4 mb-3"
    />
  </div>
</template>

<script>
import CourseStars from "~/components/page/course/CourseStars";
import CourseRateComment from "~/components/page/course/CourseRateComment";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { useEffect } from "~/utils/common";
import { mapState } from "vuex";
import CourseRatesFilter from "~/components/page/course/CourseRatesFilter";

export default {
  components: {
    CourseRateComment
  },

  props: {
    reviews: {
      types: Array,
      default: []
    },
    page: {
      types: Object,
      default: () => {}
    }
  },

  data() {
    return {
      active: 0
    };
  },

  methods: {
    get,
    onPageChange(e) {
      this.pagination = { ...this.pagination, ...e };
      this.$emit("onPageChange", get(this, "pagination.page", 1));
    }
  }
};
</script>
