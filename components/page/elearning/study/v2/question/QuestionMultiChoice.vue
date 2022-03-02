<template>
  <div class="elearning-question-type">
    <div class="eqt__content-question">
      <div>
        <span>{{ currentExerciseQuestion.index }}</span>
      </div>
      <span v-html="currentExerciseQuestion.manual.content"></span>
    </div>
    <div class="eqt__content-answer">
      <div
        v-for="(item, index) in short_answers"
        :key="index"
        class="d-flex align-items-center mb-3"
      >
        <!-- <app-checkbox
          name="answer-question mr-3"
          class="mb-15"
          :checked="answer.includes(item.id)"
          @change="handleCheckbox(item)"
          :vhtml="item.contentIndex"
        ></app-checkbox> -->
        <div class="mb-15 d-flex align-items-center">
          <app-checkbox
            name="answer-question mr-3"
            :checked="answer.includes(item.id)"
            @change="handleCheckbox(item)"
          ></app-checkbox>
          <div class="align-items-center" style="display:inline-flex" v-html="item.contentIndex"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { get } from "lodash";
import { QUESTION_ANSWER_INDEX_TEXT } from "~/utils/config";

export default {
  props: {
    questionChange: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      img: "https://picsum.photos/376/225",
      answer: [],
      selectedAnswer: []
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", [
      "currentExerciseQuestion",
      "currentExerciseAnswers"
    ]),

    short_answers() {
      return [...this.currentExerciseQuestion.short_answers]
        // .sort((a, b) => a.index - b.index)
        .map((m, index) => {
          return {
            ...m,
            contentIndex: `${QUESTION_ANSWER_INDEX_TEXT[index]}. ${m.content}`
          };
        });
    }
  },

  methods: {
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseSubmission"
    ]),

    setAnswered() {
      // set current answered you checked
      console.log(
        "[setAnswered]",
        this.currentExerciseAnswers,
        this.currentExerciseQuestion
      );
      const answered = this.currentExerciseAnswers.find(
        an => an.question_id == this.currentExerciseQuestion.id
      );
      if (answered && answered.submissions && answered.submissions.length > 0) {
        const arrSelectedId = answered.submissions.map(item => {
          return item.selected_answer_id;
        });
        console.log("[arrSelectedId]", arrSelectedId);
        this.answer = arrSelectedId;
      } else {
        this.answer = [];
      }
    },

    handleCheckbox(item) {
      console.log("[handleCheckbox]", item);
      const findAnswer = this.selectedAnswer.find(s => s.id == item.id);
      if (!findAnswer) {
        this.selectedAnswer.push(item);
      }

      let answers = [];
      this.selectedAnswer.map(sa => {
        answers.push({
          question_id: this.currentExerciseQuestion.id,
          selected_answer_id: sa.id // lựa chọn đáp án đúng với câu hỏi 1 hoặc nhiều lựa chọn hoặc lựa chọn trong câu hỏi nối
        });
      });
      this.setStudyExerciseSubmission({ answers });
    }
  },

  // mounted() {
  //   console.log("[questionChange] mounted", this.questionChange);
  //   if (this.questionChange) {
  //     this.setAnswered();
  //   }
  // },

  watch: {
    questionChange: {
      immediate: true,
      handler(_newVal, _oldVal) {
        console.log("[questionChange] watch Multiple_choice", _newVal);
        this.setAnswered();
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-question.scss";
</style>
