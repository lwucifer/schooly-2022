<template>
  <div class="">
    <div class="sbdt__question-content">
      <span v-html="currentExerciseQuestion.parsed_content"></span>
    </div>
    <div class="sbdt__answer-content sbdt__answer-content-multi-choice">
      <app-radio-group
        v-model="answer"
        class="e-exercise-choose__answers d-flex flex-column align-items-start"
      >
        <app-radio
          v-for="(ans, index) in currentExerciseQuestion.answers"
          name="answer-question"
          class="mb-3"
          :class="{ 'app-radio-error': (!ans.selected) && selectedAns(ans) }"
          :key="index"
          :value="ans.id"
          :checked="selectedAns(ans)"
          disabled
          >{{ ans.content }}</app-radio
        >
      </app-radio-group>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { get } from "lodash";

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
      answer: null
    };
  },

  computed: {
    currentExerciseQuestion() {
      return this.question;
    },
    currentExerciseAnswers() {
      return this.content;
    },
    submissions() {
      return get(this, 'currentExerciseAnswers.submissions', []);
    }
  },

  methods: {
    selectedAns(ans) {
      const ansId = get(ans, 'id', '');
      const submissionCounter = this.submissions.length;
      for (let i = 0; i < submissionCounter; i++) {
        const tmpSubmission = this.submissions[i];
        if (ansId == tmpSubmission.selected_answer_id) {
          return true;
        }
      }
      return false;
    },
    get
  },

  mounted() {
   
  },

  watch: {
  }
};
</script>

<style lang="scss">
</style>
