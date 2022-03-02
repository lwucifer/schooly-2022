<template>
  <div class="">
    <div class="sbdt__question-content">
      <span v-html="get(this, 'currentExerciseQuestion.parsed_content', '')"></span>
    </div>
    <div class="sbdt__answer-content sbdt__answer-content-multi-choice">
      <div
        v-for="(item, index) in currentExerciseQuestion.answers"
        :key="index"
      >
        <app-checkbox
          :checked="selectedAns(item)"
          :class="{ 'app-checkbox-error': (!item.selected) && selectedAns(item) }"
          disabled
        >
          <span class="d-flex mt-1">
            <span :class="{ 'font-weight-medium': item.correct }">
              {{ CHOICE_ALPHA[index] }}.&nbsp;
            </span>
            <div>
              <v-popover
                class=""
                trigger="hover"
                placement="top"
                popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
                :autoHide="false"
              >
                <div class="collapsed-content mr-3">
                  <div v-html="get(item, 'content', '')"></div>
                </div>
                <template slot="popover" class="tooltip-detail">
                  <div class="tooltip-limited-content">
                    <div v-html="get(item, 'content', '')" class="mb-3"></div>
                  </div>
                </template>
              </v-popover>
            </div>
          </span>
        </app-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { get } from "lodash";
const CHOICE_ALPHA = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export default {
  props: {
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
      CHOICE_ALPHA: Object.freeze(CHOICE_ALPHA),
      answer: [],
      selectedAnswer: []
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
};
</script>

<style lang="scss">
</style>
