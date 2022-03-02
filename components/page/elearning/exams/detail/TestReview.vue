<template>
  <section class="scroll-target elearning-id-box" id="review">
    <div class="elearning-review">
      <div class="elearning-review__top mb-4">
        <div class="row items-center">
          <div class="col-md-6 col-sm-12">
            <div class="text-center d-inline-block">
              <h1 class="h1 color-primary">
                {{
                  numeral(get(test_vote_info, "voting.average_rate", 0)).format(
                    "0,0.0"
                  )
                }}
              </h1>
              <app-stars
                :stars="
                  Math.ceil(get(test_vote_info, 'voting.average_rate', 0))
                "
                :size="16"
                class="mt-2 mb-3"
              />
              <p>
                ({{
                  numeral(get(test_vote_info, "voting.total_votes", 0)).format()
                }}
                đánh giá)
              </p>
            </div>
          </div>
          <div class="col-md-6 col-sm-12">
            <ElearningStars :voting="get(test_vote_info, 'voting', null)" />
          </div>
        </div>
      </div>

      <ElearningReviewButton
        :info="test_vote_info"
        @changeTab="changeTab"
        :tabActive="tabActive"
      />

      <div class="elearning-review__commnents">
        <div v-if="fetchingReview" class="text-center">
          <app-spin />
        </div>
        <div
          v-else-if="
            !get(votes, 'content', true) || !get(votes, 'content.length', true)
          "
          class="text-gray-2 caption text-center"
        >
          Chưa có nhận xét nào phù hợp với tiêu chí bạn đã chọn
        </div>

        <ElearningReviewComment
          :review="review"
          v-for="review in get(votes, 'content', [])"
          :key="review.id"
        />
        <app-pagination
          :pagination="get(votes, 'page', {})"
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
      default: true,
    },
    test_id: {},
  },

  computed: {
    ...mapState("elearning/exam/test", {
      votes: "votes",
      test_vote_info: "test_vote_info",
    }),
  },

  data() {
    return {
      tabActive: "all",
      fetchingReview: false,
      params: {
        test_id: this.test_id,
        page: 1,
        size: 10,
        vote: null,
      },
      paramTestVoteInfo: {
        test_id: this.test_id,
      },
    };
  },

  mounted() {
    useEffect(this, this.getVotes.bind(this), ["params"]);
    useEffect(this, this.getTestVoteInfo.bind(this), ["paramTestVoteInfo"]);
    useEffect(this, this.changeExamId.bind(this), ["test_id"]);
  },

  methods: {
    changeExamId() {
      this.params.test_id = this.test_id;
      this.paramTestVoteInfo.test_id = this.test_id;
    },

    getVotes() {
      this.$store.dispatch(`elearning/exam/test/getVotes`, this.params);
    },

    getTestVoteInfo() {
      this.$store.dispatch(
        `elearning/exam/test/getTestVoteInfo`,
        this.paramTestVoteInfo
      );
    },

    changeTab(key) {
      this.tabActive = key;
      let rate = key !== "all" ? key : null;
      this.params.vote = rate;
      this.params.page = 1;
    },

    onPageChange(page) {
      this.params.page = page;
    },

    numeral,
    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-review.scss";
</style>
