<template>
  <div class="e-study-tab-qa">
    <TabQATestEdit class="mb-15" @addCommentSuccess="addCommentSuccess" />

    <div class="d-flex align-items-center">
      <h5>
        {{ numeral(get(comments, "page.total_elements", 0)).format() }} Bình
        luận
      </h5>
      <div class="ml-auto">
        <!-- <app-search
          class="mb-0 mr-4"
          placeholder="Tìm kiếm bình luận"
          size="sm"
          v-model="params.keyword"
          @submit="search"
          @keyup.enter.native="search"
        /> -->
        <app-select
          placeholder="Sắp xếp theo"
          size="sm"
          :options="sortOpts"
          :value="paramComments.sort_by"
          @change="handleChangeSort"
        ></app-select>
      </div>
    </div>

    <div class="e-study-tab-qa__comment-list">
      <TabQACommentItem
        v-for="comment in get(comments, 'content', [])"
        :key="comment.id"
        :question="comment"
        v-slot:default="slotProps"
        :id="comment.id"
      >
        <TabQACommentEditor
          v-if="slotProps.showReply"
          class="mt-4"
          :question="comment"
        />
        <Answers :question="comment" />
      </TabQACommentItem>

      <div
        @click="handleLoadMoreQuestion"
        class="text-center"
        v-if="isShowParentMoreQuestion"
      >
        <a class="e-study-tab-qa__more">Xem thêm bình luận</a>
      </div>
    </div>
  </div>
</template>

<script>
import IconSearch from "~/assets/svg/v2-icons/search_24px.svg?inline";
import TabQATestEdit from "~/components/page/elearning/exams/detail/TabQATestEdit.vue";
import TabQACommentItem from "~/components/page/elearning/exams/detail/TabQACommentItem.vue";
import Answers from "~/components/page/elearning/exams/detail/Answers.vue";
import TabQACommentEditor from "~/components/page/elearning/exams/detail/TabQACommentEditor.vue";
import { get } from "lodash";
import { mapState } from "vuex";
import numeral from "numeral";
import { useEffect, getParamQuery } from "~/utils/common";

export default {
  components: {
    IconSearch,
    TabQATestEdit,
    TabQACommentItem,
    TabQACommentEditor,
    Answers,
  },

  props: {
    test_id: {},
  },

  mounted() {
    useEffect(this, this.getComments.bind(this), ["paramComments"]);
    useEffect(this, this.changeTestId.bind(this), ["test_id"]);
  },

  computed: {
    ...mapState("elearning/exam/test", { comments: "comments" }),

    isShowParentMoreQuestion() {
      const currPage = get(this, "comments.page.number", 0) + 1;
      const totalPage = get(this, "comments.page.total_pages", 0);
      return currPage < totalPage;
    },
  },

  data() {
    return {
      sortOpts: [
        {
          id: -1,
          text: `Sắp xếp theo`,
          value: null,
        },
        {
          value: "FAVOURITE",
          text: "Thích nhiều nhất",
        },
        {
          value: "NEWEST",
          text: "Mới nhất",
        },
        {
          value: "OLDEST",
          text: "Cũ nhất",
        },
      ],
      paramComments: {
        test_id: this.test_id,
        page: 1,
        sort_by: null, //NEWEST | OLDEST | FAVOURITE
      },
      isScroll: false,
    };
  },

  methods: {
    changeTestId() {
      this.paramComments.test_id = this.test_id;
    },

    addCommentSuccess() {
      this.getComments();
    },

    getComments() {
      this.$store.dispatch(
        "elearning/exam/test/getComments",
        this.paramComments
      );
    },

    handleChangeSort(value) {
      this.paramComments.sort_by = value;
      this.paramComments.page = 1;
    },

    handleLoadMoreQuestion() {
      this.paramComments.page = get(this, "comments.page.number", 0) + 2;
    },

    get,
    numeral,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/_tab-qa.scss";
</style>
