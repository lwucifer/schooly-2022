<template>
  <div class="modal-result-answer">
    <p class="dont-break-out" v-html="questionName"></p>
    <div class="d-flex align-items-center px-4 pt-3">
      <fragment v-if="!answerItems || answerItems.length < 1">
        <span style="min-width: 9rem;">Câu trả lời :</span>
        <div class="d-flex align-items-center text-error">
          <IconClose height="24" class="fill-secondary" />
        </div>
      </fragment>
      
      <fragment v-for="(item, index) in answerItems" :key="index">
        <span style="min-width: 9rem;">Câu trả lời : {{ item.indexName }}</span>
        <div
          class="d-flex align-items-center text-success"
          v-if="item.result == 1"
        >
          <span class="dont-break-out" v-html="item.content"></span>
          <IconCheck height="24" class="fill-primary" />
        </div>
        <div
          class="d-flex align-items-center text-error"
          v-if="item.result == -1"
        >
          <span class="dont-break-out" v-html="item.content"></span>
          <IconClose24px height="24" class="fill-secondary" />
        </div>
      </fragment>
    </div>
    <div
      class="px-4 pt-3"
      v-if="questionResult != 1"
    >
      <span class="mb-5" style="min-width: 9rem;">Đáp án đúng:</span>
      <fragment v-for="(item, index) in correctItems" :key="index">
        <div class="d-flex">
          <div class="mr-2"><span class="d-block w-20">{{ item.indexName }} .</span></div>
          <div
            class="d-flex align-items-center"
            v-html="item.content"
            style="margin-right: 1rem;"
          ></div>
        </div>
      </fragment>
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
        "Câu hỏi chọn nhiều đáp án"
      )}`;
    },

    questionResult() {
      return get(this, "result.userAnswer.result", -1); // kết quả (-1: sai | 0: chờ chấm | 1: đúng)
    },

    answerItems() {
      // console.log("[answerItems]", this.result.userAnswer.submissions);
      const userAnswer = this.result.userAnswer;
      const items = get(this, "result.userAnswer.submissions", []).map(s => {
        const selected_answer_id = s.selected_answer_id;
        const shortAns = this.result.short_answers.find(
          item => item.id == selected_answer_id
        );
        if (shortAns) {
          return {
            index: shortAns.index,
            indexName: QUESTION_ANSWER_INDEX_TEXT[shortAns.index],
            content: shortAns.content,
            result: userAnswer.result
          };
        }
        return {};
      });

      // console.log("[answerItems] items", items);
      return items;
    },

    correctItems() {
      return this.result.short_answers
        .filter(item => item.correct == true)
        .map(m => {
          return {
            ...m,
            indexName: QUESTION_ANSWER_INDEX_TEXT[m.index]
          };
        });
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
