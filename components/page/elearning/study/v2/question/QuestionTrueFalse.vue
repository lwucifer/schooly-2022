<template>
  <div class="elearning-question-type">
    <div class="eqt__content-question">
      <div>
        <span>{{ currentExerciseQuestion.index }}</span>
      </div>
      <span v-html="currentExerciseQuestion.manual.content"></span>
    </div>
    <div class="eqt__content-answer">
      <app-radio-group
        v-model="answer"
        class="e-exercise-choose__answers d-flex flex-column align-items-start"
      >
        <app-radio
          v-for="(ans, index) in short_answers"
          name="answer-question"
          class="mb-15"
          :key="index"
          :value="ans.id"
          :checked="ans.id == answer"
          >{{ ans.contentIndex }}</app-radio
        >
      </app-radio-group>
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
      answer: null,
      QUESTION_ANSWER_INDEX_TEXT: QUESTION_ANSWER_INDEX_TEXT
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", [
      "currentExerciseQuestion",
      "currentExerciseAnswers"
    ]),

    short_answers() {
      return (
        [...this.currentExerciseQuestion.short_answers]
          // .sort((a, b) => a.index - b.index)
          .map((m, index) => {
            return {
              ...m,
              contentIndex: `${QUESTION_ANSWER_INDEX_TEXT[index]}. ${m.content}`
            };
          })
      );
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
        this.answer = answered.submissions[0].selected_answer_id;
      } else {
        this.answer = null;
      }
    }
  },

  // mounted() {
  //   console.log("[questionChange] mounted", this.questionChange);
  //   if (this.questionChange) {
  //     this.setAnswered();
  //   }
  // },

  watch: {
    answer(_newVal, _oldVal) {
      const answers = [
        {
          question_id: this.currentExerciseQuestion.id,
          selected_answer_id: this.answer // lựa chọn đáp án đúng với câu hỏi 1 hoặc nhiều lựa chọn hoặc lựa chọn trong câu hỏi nối
        }
      ];
      console.log("[answer] watch", _newVal, _oldVal, answers);
      if (_newVal != _oldVal) {
        this.setStudyExerciseSubmission({ answers });
      }
    },

    questionChange: {
      immediate: true,
      handler(_newVal, _oldVal) {
        console.log("[questionChange] watch True_False", _newVal);
        this.setAnswered();
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-question.scss";
</style>
