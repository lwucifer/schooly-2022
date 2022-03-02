<template>
  <app-button square normal :color="color" @click="handleClick"
    >{{ get(rate, "rate") }} sao ({{ get(rate, "count", 0) }})
  </app-button>
</template>

<script>
import CourseStars from "~/components/page/course/CourseStars";
import CourseRateComment from "~/components/page/course/CourseRateComment";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { useEffect } from "~/utils/common";
import { mapState } from "vuex";

export default {
  components: {
    CourseStars,
    CourseRateComment
  },

  props: {
    rate: {
      type: Object,
      default: null
    },
    color: {
      type: String,
      default: "gray"
    }
  },

  methods: {
    get,
    handleClick() {
      this.$emit("handleClick", this.rate);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/_course-rates.scss";
</style>
