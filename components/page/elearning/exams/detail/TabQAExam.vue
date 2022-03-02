<template>
  <div class="e-study-tab-qa">
    <TabQAEditor class="mb-15" @addCommentSuccess="addCommentSuccess" />

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
import TabQAEditor from "~/components/page/elearning/exams/detail/TabQAEditor.vue";
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
    TabQAEditor,
    TabQACommentItem,
    TabQACommentEditor,
    Answers,
  },

  props: {
    exam_id: {},
  },

  mounted() {
    useEffect(this, this.getComments.bind(this), ["paramComments"]);
    useEffect(this, this.changeExamId.bind(this), ["exam_id"]);
  },

  computed: {
    ...mapState("elearning/exam/exam", { comments: "comments" }),

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
        exam_id: this.exam_id,
        page: 1,
        sort_by: null, //NEWEST | OLDEST | FAVOURITE
      },
      isScroll: false,
    };
  },

  methods: {
    changeExamId() {
      this.paramComments.exam_id = this.exam_id;
    },

    addCommentSuccess() {
      this.getComments();
    },

    getComments() {
      this.$store.dispatch(
        "elearning/exam/exam/getComments",
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
