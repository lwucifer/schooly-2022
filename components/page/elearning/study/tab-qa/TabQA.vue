<template>
  <div class="e-study-tab-qa">
    <TabQAEditor class="mb-15" />

    <div class="d-flex align-items-center">
      <h5>
        {{ numeral(get(questions, "page.total_elements", 0)).format() }} Bình
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
          :value="params.sort_by"
          @change="handleChangeSort"
        ></app-select>
      </div>
    </div>

    <div class="e-study-tab-qa__comment-list">
      <TabQACommentItem
        v-for="question in get(questions, 'content', [])"
        :key="question.id"
        :question="question"
        v-slot:default="slotProps"
        :id="question.id"
      >
        <TabQACommentEditor
          v-if="slotProps.showReply"
          class="mt-4"
          :question="question"
        />
        <Answers :question="question" />
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
import TabQAEditor from "~/components/page/elearning/study/tab-qa/TabQAEditor.vue";
import TabQACommentItem from "~/components/page/elearning/study/tab-qa/TabQACommentItem.vue";
import Answers from "~/components/page/elearning/study/tab-qa/Answers.vue";
import TabQACommentEditor from "~/components/page/elearning/study/tab-qa/TabQACommentEditor.vue";
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

  mounted() {
    useEffect(this, this.handleGetQuestions.bind(this), ["params"]);
  },

  computed: {
    ...mapState("elearning/study/detail", {
      questions: "questions",
    }),
    isShowParentMoreQuestion() {
      const currPage = get(this.questions, 'page.number', 0) + 1;
      const totalPage = get(this.questions, 'page.total_pages', 0);

      return (currPage < totalPage)  
    }
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
      params: {
        elearning_id: get(this, "$route.params.id", ""),
        page: 1,
        sort_by: null, //NEWEST | OLDEST | FAVOURITE
      },
      isScroll:false
    };
  },

  methods: {

    handleChangeSort(value) {
      this.params.sort_by = value;
      this.params.page = 1;
    },
    handleGetQuestions() {
      this.$store.dispatch(`elearning/study/detail/getListQuestion`, {
        params: this.params,
      });
    },
    handleLoadMoreQuestion() {
      this.params.page = get(this, "questions.page.number", 0) + 2;
    },
    get,
    numeral,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/_tab-qa.scss";
</style>
