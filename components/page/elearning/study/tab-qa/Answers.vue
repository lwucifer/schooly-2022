<template>
  <div>
    <div>
      <TabQACommentItem
        v-for="(ans, index) in visibleAnswers"
        :question="ans"
        :questionId="question.id"
        :level="2"
        :key="index"
      />
    </div>
    <a
      v-if="isShowAnswerMore"
      class="e-study-tab-qa__more e-study-tab-qa__more--child"
      @click.prevent="handleGetAnswers"
      >Xem thêm bình luận</a
    >
  </div>
</template>

<script>
import TabQACommentItem from "~/components/page/elearning/study/tab-qa/TabQACommentItem.vue";
import { get } from "lodash";
import { useEffect, getParamQuery } from "~/utils/common";
import InteractiveAnswer from "~/services/elearning/study/InteractiveAnswer";
import { PAGE_SIZE } from "~/utils/constants";
import { RESPONSE_SUCCESS } from "../../../../../utils/config";

export default {
  components: {
    TabQACommentItem
  },

  data() {
    return {
      currentSize: PAGE_SIZE.SHORT_5,
      moreAnswers: null,
      queryList: {
        size: PAGE_SIZE.SHORT_5
      }
    };
  },

  props: {
    question: {}
  },

  computed: {
    isShowAnswerMore() {
      if (!this.moreAnswers) {
        return get(this, "question.answers", 0) > 5;
      } else {
        const currPage = get(this, "moreAnswers.page.number", 0) + 1;
        const totalPage = get(this, "moreAnswers.page.total_pages", 0);
        return currPage < totalPage;
      }
    },

    visibleAnswers() {
      const initialAnswers = get(this, "question.interactive_answers", []);
      const updatedAnswers = get(this, "moreAnswers.content", []);
      console.log('visibleAnswers', [...initialAnswers, ...updatedAnswers])
      return [...initialAnswers, ...updatedAnswers];
    }
  },

  methods: {
    get,
    async handleGetAnswers() {
      this.queryList.size = this.queryList.size + 5
      const params = {
        page: get(this, "moreAnswers.page.number", 0) + 1,
        question_id: this.question.id,
        size: this.queryList.size
      };
      console.log("[handleGetAnswers]", params);
      const res = await new InteractiveAnswer(this.$axios)["getAnswers"](
        params
      );
      console.log("[handleGetAnswers] res", res);
      this.moreAnswers = res;
    }
  }
};
</script>
