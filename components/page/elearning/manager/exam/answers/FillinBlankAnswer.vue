<template>
  <div class="">
    <div class="sbdt__question-content">
      <span>Điền từ vào các ô trống bên dưới:</span>
    </div>
    <div class="sbdt__answer-content sbdt__answer-content-choice-word">
      <div
        class="d-flex align-items-center"
        v-html="questionHtml"
      ></div>
      <div class="d-flex mt-4">
        <button
          class="btn-answer"
          :class="{ 'text-primary': item.selected }"
          v-for="(item, index) in currentExerciseQuestion.answers"
          :key="index"
          disabled
        >
          {{ item.content }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { get } from "lodash";

function replaceRange(s, start, end, substitute) {
  return s.substring(0, start) + substitute + s.substring(end);
}

export default {
  props: {
    questionChange: {
      type: Boolean,
      default: false
    },
    content: {
			type: Object,
			default: () => {}
		},
		question: {
			type: Object,
			default: () => {}
		},
  },

  data() {
    return {
    };
  },

  computed: {
    currentExerciseQuestion() {
      return this.question;
    },
    currentExerciseAnswers() {
      return this.content;
    },
    answers() {
      return get(this, 'currentExerciseQuestion.answers', []);
    },
    submissions() {
      return get(this, 'currentExerciseAnswers.submissions', []);
    },
    questionHtml() {
      const reg = /\[.*?\]/gi;
      let str = this.currentExerciseQuestion.parsed_content;
      // let str = "<p>Hà [red|green] hệ mặt trời là [sao Mộc|sao Hỏa|Trái Đất]</p><p></p>";
      let currentPosition = 0;
      let matches = [...str.matchAll(reg)];
      const matchesCounter = matches.length;
      for (let i = 0; i < matchesCounter; i++) {
        matches = [...str.matchAll(reg)];
        if (matches.length > 0) {
          currentPosition += 1;
          const tmp = matches[0];
          const tmpSubmission = this.getSubmissionByPosition(currentPosition);
          const tmpAnswerOfStudent = this.getAnswerById(get(tmpSubmission, 'selected_answer_id', ''));
          const currentPositionCorrectAns = this.getCorrectAnsByPosition(currentPosition);
          const inputCls = get(currentPositionCorrectAns, 'id', '') == tmpAnswerOfStudent.id ? 'choice-word--correct' : 'choice-word--incorrect';

          const replaceLastIndex = tmp.index + tmp[0].length;
          const replacedString = "<input class='question-input question-input__md " + inputCls + "' " +
            "disabled " + 
            "value='" +
            get(tmpSubmission, 'answer', '') + "'/>";
          str = this.replaceRange(str, tmp.index, replaceLastIndex, replacedString);
        }
      }
      return str;
    }
  },
  methods: {
    getAnswerById(answerId) {
      const answerCounter = this.answers.length;
      for (let i = 0; i < answerCounter; i++) {
        const tmp = this.answers[i];
        if (tmp.id == answerId) {
          return tmp;
        }
      }
      return {};
    },
    getSubmissionByPosition(position) { // get submission object of student
      const submissionCounter = this.submissions.length;
      for (let i = 0; i < submissionCounter; i++) {
        const tmp = this.submissions[i];
        if (tmp.position == position) {
          return tmp;
        }
      }
      return {};
    },
    getCorrectAnsByPosition(position) {
      const answerCounter = this.answers.length;
      for (let i = 0; i < answerCounter; i++) {
        const tmp = this.answers[i];
        if (tmp.position == position && tmp.selected) {
          return tmp;
        }
      }
      return {};
    },
    get,
    replaceRange
  },
};
</script>

<style lang="scss">
</style>
