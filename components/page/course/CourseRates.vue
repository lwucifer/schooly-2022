<template>
  <div class="course-rates">
    <course-stars :reviews="get(votes, 'reviews', null)" />
    <course-rates-filter
      :rates="get(votes, 'reviews.rates', [])"
      @handleFilterRate="handleFilterRate"
    />
    <course-reviews
      :reviews="get(votes, 'content', [])"
      :page="get(votes, 'page', {})"
      @onPageChange="onPageChange"
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
import CourseReviews from "~/components/page/course/CourseReviews";

export default {
  components: {
    CourseStars,
    CourseRateComment,
    CourseRatesFilter,
    CourseReviews
  },

  created() {
    useEffect(this, this.getElearningPublicVotes.bind(this), [
      "$route.params.id",
      "params.page",
      "params.rate"
    ]);
  },

  computed: {
    ...mapState("elearning/public/public-vote", {
      votes: "votes"
    })
  },

  data() {
    return {
      params: {
        page: 1,
        // elearning_id: get(this, "$route.params.id", ""),
        elearning_id: "39fe1dd5-2df2-465f-8cf7-59d4ead68189",
        size: 10,
        rate: ""
      }
    };
  },

  methods: {
    get,
    getElearningPublicVotes() {
      const options = {
        params: this.params
      };
      this.$store.dispatch(
        `elearning/public/public-vote/${actionTypes.ELEARNING_PUBLIC_VOTE.LIST}`,
        options
      );
    },
    onPageChange(page) {
      this.params.page = page;
    },
    handleFilterRate(rate) {
      this.params.page = 1
      this.params.rate = get(rate, "rate", "");
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/_course-rates.scss";
</style>
