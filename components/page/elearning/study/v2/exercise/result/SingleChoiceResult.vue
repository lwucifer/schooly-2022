<template>
  <div class="modal-result-answer">
    <p v-html="questionName"></p>
    <div class="d-flex align-items-center px-4 pt-3">
      <span style="min-width: 9rem;">Câu trả lời : {{ answerIndexName }}.</span>

      <div class="d-flex align-items-center" :class="textStatus">
        <span class="dont-break-out" v-html="answerItem.content"></span>
        <IconCheck
          height="24"
          class="fill-primary"
          v-if="questionResult == 1"
        />
        <IconClose height="24" class="fill-secondary" v-else />
      </div>
    </div>
    <div
      class="d-flex align-items-center px-4 pt-3"
      v-if="questionResult != 1"
    >
      <div><span  class="d-block" style="min-width: 11rem;">Đáp án đúng: {{ correctIndexName }}.</span></div>
      <div class="d-flex align-items-center">
        <span class="dont-break-out" v-html="correctItem.content"></span>
      </div>
    </div>
  </div>
</template>

<script>
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconCheck from "~/assets/svg/design-icons/check.svg?inline";
import IconClose24px from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconKeyboardArrowUp24px from "~/assets/svg/v2-icons/keyboard_arrow_up_24px.svg?inline";
import IconKeyboardArrowDown24px from "~/assets/svg/v2-icons/keyboard_arrow_down_24px.svg?inline";

import { mapState } from "vuex";
import { get } from "lodash";
import { QUESTION_ANSWER_INDEX_TEXT } from "~/utils/config";

export default {
  components: {
    IconClose,
    IconCheck,
    IconClose24px,
    IconKeyboardArrowUp24px,
    IconKeyboardArrowDown24px
  },

  props: {
    result: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      extend: false
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", ["submissions"]),

    questionName() {
      const index = get(this, "result.index", 0);
      return `Câu hỏi số ${index}. ${get(
        this,
        "result.manual.content",
        "Trả lời đúng hoặc sai"
      )}`;
    },

    questionResult() {
      return get(this, "result.userAnswer.result", -1); // kết quả (-1: sai | 0: chưa trả lời | 1: đúng)
    },

    answerItem() {
      console.log("[answerItem] single");
      const selected_answer_id = get(
        this,
        "result.userAnswer.submissions[0]",
        {}
      ).selected_answer_id;
      if (!selected_answer_id) return "";
      const tmp = this.result.short_answers.find(
        item => item.id == selected_answer_id
      );
      if (!tmp) return "";

      return tmp;
    },

    answerIndexName() {
      return QUESTION_ANSWER_INDEX_TEXT[this.answerItem.index];
    },

    correctItem() {
      return this.result.short_answers.find(item => item.correct) || {};
    },
    correctIndexName() {
      return QUESTION_ANSWER_INDEX_TEXT[this.correctItem.index];
    },

    textStatus() {
      return this.questionResult == 1 ? "text-success" : "text-error";
    },
    iconStatus() {
      return this.questionResult == 1 ? "fill-primary" : "fill-secondary";
    }
  },

  methods: {
    handleClickExtend() {
      this.extend = !this.extend;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-modal-result.scss";
</style>
