<template>
  <div class="modal-result-answer">
    <p class="dont-break-out" v-html="questionName"></p>
    <!-- <div class="drop-extend" @click="handleClickExtend" v-if="extend">
      Thu gọn
      <IconKeyboardArrowUp24px class="fill-primary" />
    </div> -->
    <div class="drop-extend text-error" :class="textStatus">
      Câu trả lời:
      <IconKeyboardArrowDown24px :class="iconStatus" />
    </div>
    <div class="content-answer dont-break-out" v-html="userAnswer"></div>

    <div class="drop-extend" v-if="questionResult != 1">
      Đáp án đúng:
      <IconKeyboardArrowDown24px class="fill-primary" />
    </div>
    <div
      class="content-answer dont-break-out"
      v-html="correctAnswer"
      v-if="questionResult != 1"
    ></div>
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
        "Điền từ vào chỗ trống"
      )}`;
    },

    questionResult() {
      return get(this, "result.userAnswer.result", -1); // kết quả (-1: sai | 0: chưa trả lời | 1: đúng)
    },

    userAnswer() {
      let question = get(this, "result.manual.content", "");
      const shortAns = get(this, "result.short_answers", []);
      [...this.result.userAnswer.submissions]
        .sort((a, b) => a.position < b.position)
        .map(item => {
          const ans = shortAns.find(s => s.id == item.selected_answer_id) || {};
          question = question.replace("[]", `[${ans.content}]`);
        });
      console.log("[userAnswer]", question);
      return question;
    },

    correctAnswer() {
      let question = get(this, "result.manual.content", "");
      const shortAns = get(this, "result.short_answers", []);
      this.correctItems
        .sort((a, b) => a.position < b.position)
        .map(item => {
          question = question.replace("[]", `[${item.content}]`);
        });
      console.log("[correctAnswer]", question);
      return question;
    },

    correctItems() {
      return this.result.short_answers.filter(item => item.correct == true);
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
