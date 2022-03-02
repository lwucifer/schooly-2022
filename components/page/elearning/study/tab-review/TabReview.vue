<template>
  <div class="e-study-tab-review">
    <TabReviewEditor class="mb-15" />

    <TabReviewItem
      v-for="(review, index) in get(reviews, 'content', [])"
      :key="index"
      :review="review"
    />
    <app-pagination
      class="mt-4"
      :pagination="get(reviews, 'page', {})"
      @pagechange="handleChangePage"
    />
  </div>
</template>

<script>
import TabReviewItem from "~/components/page/elearning/study/tab-review/TabReviewItem.vue";
import TabReviewEditor from "~/components/page/elearning/study/tab-review/TabReviewEditor.vue";
import { get } from "lodash";
import { useEffect } from "~/utils/common";
import { mapState } from "vuex";

export default {
  components: {
    TabReviewItem,
    TabReviewEditor,
  },

  computed: {
    ...mapState("elearning/study/detail", {
      reviews: "reviews",
    }),
  },

  data() {
    return {
      params: {
        elearning_id: get(this, "$route.params.id", ""),
        page: 1,
        size: 10,
      },
    };
  },

  mounted() {
    useEffect(this, this.getVotes.bind(this), ["params"]);
  },

  methods: {
    handleChangePage(page) {
      this.params.page = page;
    },

    getVotes() {
      this.$store.dispatch(`elearning/study/detail/getReviews`, this.params);
    },
    get,
  },
};
</script>

<style></style>
