<template>
  <app-modal
    centered
    :width="750"
    :footer="false"
    @close="$emit('close')"
    :componentClass="{ 'modal-exercise-result': true }"
  >
    <div class="d-flex" slot="header">
      <h3>Xem đáp án</h3>
      <button class="ml-auto" @click="$emit('close')">
        <IconClose class="d-block fill-opacity-1" />
      </button>
    </div>

    <div slot="content">
      <div v-if="loading">
        <div class="bg-white">
          <VclList />
          <VclList />
        </div>
      </div>
      <div v-else>
        <div class="modal-resul__teacher-comment">
          <p class="text-dark heading-4 font-weight-medium">
            {{ testName }}
          </p>
          <p class="text-dark font-weight-medium mt-4 mb-3">
            Nhận xét của giáo viên
          </p>
          <div class="content-comment dont-break-out" v-html="testNote"></div>
        </div>

        <p class="text-dark font-weight-medium mb-3">Câu hỏi và câu trả lời</p>
        <fragment v-for="(item, index) in submissionAnswers" :key="index">
          <SingleChoiceResult :result="item" v-if="isSingleChoiceType(item)" />

          <MultipleChoiceResult
            :result="item"
            v-if="item.type == 'MULTIPLE_CHOICE'"
          />

          <FillBlankResult :result="item" v-if="item.type == 'FILL_IN_BLANK'" />

          <WordChoiceResult :result="item" v-if="item.type == 'WORD_CHOICE'" />

          <MachingResult :result="item" v-if="item.type == 'WORD_MATCH'" />

          <EssayResult :result="item" v-if="item.category == 'ESSAY'" />
        </fragment>
      </div>
    </div>
  </app-modal>
</template>

<script>
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconCheck from "~/assets/svg/design-icons/check.svg?inline";
import IconClose24px from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconKeyboardArrowUp24px from "~/assets/svg/v2-icons/keyboard_arrow_up_24px.svg?inline";
import IconKeyboardArrowDown24px from "~/assets/svg/v2-icons/keyboard_arrow_down_24px.svg?inline";
import SingleChoiceResult from "./result/SingleChoiceResult";
import MultipleChoiceResult from "./result/MultipleChoiceResult";
import EssayResult from "./result/EssayResult";
import FillBlankResult from "./result/FillBlankResult";
import WordChoiceResult from "./result/WordChoiceResult";
import MachingResult from "./result/MachingResult";
import { VclList } from "vue-content-loading";

import { mapState } from "vuex";
import { get } from "lodash";

export default {
  components: {
    IconClose,
    IconCheck,
    IconClose24px,
    IconKeyboardArrowUp24px,
    IconKeyboardArrowDown24px,
    SingleChoiceResult,
    EssayResult,
    MultipleChoiceResult,
    FillBlankResult,
    WordChoiceResult,
    MachingResult,
    VclList
  },
  props: {
    loading: Boolean
  },
  data() {
    return {
      result: true,
      type: "CHOICE",
      comment: true,
      extend: false
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", ["submissions", "questions"]),
    submissionAnswers() {
      const answers = get(this, "submissions.answers", []);
      const questionList = get(this, "questions", []);
      const result = questionList.map(q => {
        const ans = answers.find(an => an.question_id == q.id);
        return {
          ...q,
          userAnswer: ans
        };
      });

      console.log("[submissionAnswers]", result);
      return result;
    },
    testName() {
      return get(this, "submissions.name", "");
    },
    testNote() {
      return get(this, "submissions.note", "<Không có nhận xét nào>");
    }
  },

  methods: {
    handleClickExtend() {
      this.extend = !this.extend;
    },
    isSingleChoiceType(item) {
      return item.type == "YES_NO" || item.type == "SINGLE_CHOICE";
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-modal-result.scss";
</style>
