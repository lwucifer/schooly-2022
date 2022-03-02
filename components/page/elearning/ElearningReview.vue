<template>
  <section class="scroll-target elearning-id-box" id="review">
    <h4 class="mb-3" v-if="titleProps">Đánh giá {{ title }}</h4>
    <div class="elearning-review">
      <div class="elearning-review__top mb-4">
        <div class="row items-center">
          <div class="col-md-6 col-sm-12">
            <div class="text-center d-inline-block">
              <h1 class="h1 color-primary">
                {{
                  numeral(get(info, "voting.average_rate", 0)).format("0,0.0")
                }}
              </h1>
              <app-stars
                :stars="Math.ceil(get(info, 'voting.average_rate', 0))"
                :size="16"
                class="mt-2 mb-3"
              />
              <p>
                ({{ numeral(get(info, "voting.total_votes", 0)).format() }}
                đánh giá)
              </p>
            </div>
          </div>
          <div class="col-md-6 col-sm-12">
            <ElearningStars :voting="get(info, 'voting', null)" />
          </div>
        </div>
      </div>

      <ElearningReviewButton
        :info="info"
        @changeTab="changeTab"
        :tabActive="tabActive"
      />

      <div class="elearning-review__commnents">
        <div v-if="fetchingReview" class="text-center">
          <app-spin />
        </div>
        <div
          v-else-if="
            !get(reviews, 'content', true) ||
              !get(reviews, 'content.length', true)
          "
          class="text-gray-2 caption text-center"
        >
          Chưa có nhận xét nào phù hợp với tiêu chí bạn đã chọn
        </div>

        <ElearningReviewComment
          :review="review"
          v-for="review in get(reviews, 'content', [])"
          :key="review.id"
        />
        <app-pagination
          :pagination="get(reviews, 'page', {})"
          @pagechange="onPageChange"
          class="mt-4 mb-3"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { get } from "lodash";
import { BASE as ACTION_TYPE_BASE } from "~/utils/action-types";
import VoteService from "~/services/elearning/public/Vote.js";
import ElearningStars from "~/components/page/elearning/ElearningStars";
import ElearningReviewComment from "~/components/page/elearning/ElearningReviewComment";
import ElearningReviewButton from "~/components/page/elearning/ElearningReviewButton";
import { ELEARNING_TYPES } from "~/utils/constants";
import { mapState } from "vuex";
import { useEffect } from "~/utils/common";
import numeral from "numeral";

export default {
  components: {
    ElearningStars,
    ElearningReviewComment,
    ElearningReviewButton,
  },

  props: {
    titleProps: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    title() {
      if (this.info) {
        switch (this.info.type) {
          case ELEARNING_TYPES.LECTURE:
            return "bài giảng";
            break;
          case ELEARNING_TYPES.COURSE:
            return "khoá học";
            break;
          default:
            break;
        }
      }
    },
    ...mapState("elearning/detail", {
      info: "info",
      reviews: "reviews",
    }),
  },

  data() {
    return {
      tabActive: "all",
      fetchingReview: false,
      params: {
        elearning_id: get(this, "$route.params.id"),
        rate: "",
        page: 1,
      },
    };
  },

  mounted() {
    useEffect(this, this.getReviews.bind(this), ["params"]);
  },

  methods: {
    getReviews() {
      const options = {
        params: this.params,
      };
      this.$store.dispatch(`elearning/detail/getReviews`, options);
    },

    get,

    async changeTab(key) {
      this.tabActive = key;
      let rate = key !== "all" ? key : null;
      this.params.rate = rate;
      this.params.page = 1;
    },

    onPageChange(page) {
      this.params.page = page;
    },
    numeral,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-review.scss";
</style>
