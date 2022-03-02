<template>
  <div class="ee-comments">
    <div class="ee-comment-item">
      <div class="ee-comment-item__top">
        <div class="ee-comment-item__heading">{{ result.name }}</div>
        <div class="ee-comment-item__point">
          Điểm:
          <b>{{ resultRate }}</b>
        </div>
      </div>

      <div class="ee-comment-item__comment">
        <p v-html="result.note"></p>
      </div>

      <div
        class="ee-comment-item__question-item"
        v-for="(s, index) in mergeSubmissionQuestion"
        :key="index"
      >
        <div class="ee-comment-item__title">{{ s.index }}. Câu hỏi {{ s.index }}</div>
        <div class="ee-comment-item__content" v-html="s.content"></div>
        <!-- <app-input
          textarea
          :autosize="false"
          readonly
          v-html="s.content"
        />-->

        <div class="ee-comment-item__title">Câu trả lời</div>
        <div class="ee-comment-item__content" v-html="s.student_answer"></div>
        <!-- <app-input
          textarea
          :autosize="false"
          readonly
          v-html="s.student_answer"
        />-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getExerciseResultText } from "~/plugins/filters";

export default {
  computed: {
    ...mapState("elearning/study/study-exercise", [
      "submissions",
      "questions",
      "result"
    ]),

    mergeSubmissionQuestion() {
      const tmp = this.questions.map((q, index) => {
        const answered = this.submissions.find(s => s.question_id == q.id);
        let correct_answer = null;
        let student_answer = null;
        // let result = null;
        let isUserTrue = false;
        if (answered) {
          // correct_answer = q.answers.find(a => a.id == answered.correct_answer);
          student_answer = answered.student_answer;
          // result = answered.result;
          isUserTrue = answered.correct_answer == answered.student_answer;
        }
        return {
          ...q,
          // content: `${index + 1}.xxx${q.content}`,
          // correct_answer,
          student_answer,
          // result,
          isUserTrue
        };
      });
      console.log("[mergeSubmissionQuestion]", tmp);
      return tmp;
    },

    resultRate() {
      return `${this.result.mark || 0}/${
        this.result.max_score || 0
      } (${getExerciseResultText(this.result.result)})`;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exercise/_elearning-exercise-comments.scss";
</style>