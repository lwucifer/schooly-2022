<template>
  <ol class="e-exercise-list-questions">
    <ElearningExerciseListQuestionsItem
      v-for="(item, index) in mergeSubmissionQuestion"
      :key="index"
      :question="item"
      :isAnswer="isAnswer"
    />
  </ol>
</template>

<script>
import { EXERCISE_TYPES } from "~/utils/constants";
import ElearningExerciseListQuestionsItem from "~/components/page/elearning/study/exercise/ElearningExerciseListQuestionsItem.vue";
import { mapState } from "vuex";

export default {
  components: {
    ElearningExerciseListQuestionsItem
  },

  props: {
    type: {
      type: String,
      default: EXERCISE_TYPES.ESSAY,
      validator: value => Object.values(EXERCISE_TYPES).includes(value)
    },
    isAnswer: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState("elearning/study/study-exercise", ["submissions", "questions"]),

    mergeSubmissionQuestion() {
      const tmp = this.questions.map((q, index) => {
        const answered = this.submissions.find(s => s.question_id == q.id);
        let correct_answer = null;
        let student_answer = null;
        let result = null;
        let isUserTrue = false;
        if (answered) {
          correct_answer = q.answers.find(a => a.id == answered.correct_answer);
          student_answer = q.answers.find(a => a.id == answered.student_answer);
          result = answered.result;
          isUserTrue = answered.correct_answer == answered.student_answer;
        }
        return {
          ...q,
          // content: `${index + 1}.xxx${q.content}`,
          correct_answer,
          student_answer,
          result,
          isUserTrue
        };
      });

      console.log("[mergeSubmissionQuestion]", tmp, this.questions, this.submissions);
      return tmp;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exercise/_elearning-exercise-list-questions.scss";
</style>