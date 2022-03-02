<template>
  <div class="">
    <div class="sbdt__question-content">
      <span v-html="get(this, 'currentExerciseQuestion.parsed_content', '')"></span>
    </div>
    <div class="sbdt__answer-content">
      <div class="row">
        <template
          v-for="(item, index) in matchingSubmssions"
        >
          <div
            :key="`${index}-left`"
            class="col-md-6 mb-15"
          >
            <div
              class="question-join-answer_item-left h-100"
              v-html="get(item, 'left.content', '')"
            ></div>

          </div>
          <div
            :key="`${index}-right`"
            class="col-md-6 mb-15"
          >
            <div
              class="question-join-answer_item-right h-100"
              v-html="get(item, 'right.content', '')"
            ></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { get } from "lodash";
import draggable from "vuedraggable";

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
		}
  },

  components: {
    draggable
  },

  data() {
    return {
      answer: null,
    };
  },
  computed: {
    currentExerciseQuestion() {
      return this.question;
    },
    currentExerciseAnswers() {
      return this.content;
    },
    leftAnswers() {
      return get(this, "currentExerciseQuestion.answers", []).filter(
        item => item.position == -1
      );
    },
    rightAnswers() {
      return get(this, "currentExerciseQuestion.answers", []).filter(
        item => item.position == 1
      );
    },
    submissions() {
      return get(this, 'currentExerciseAnswers.submissions', []);
    },
    matchingSubmssions() {
      const submissionsCounter = this.submissions.length;
      let matchingData = [];
      for (let i = 0; i < submissionsCounter; i++) {
        const tmp = this.submissions[i];
        const leftPharseId = tmp.selected_answer_id;
        const rightPharseId = tmp.matching_answer_id;
        const fullPhrase = {
          left: this.findLeftSubmissionPhrase(leftPharseId),
          right: this.findRightSubmissionPhrase(rightPharseId)
        }
        matchingData.push(fullPhrase);
      }
      return matchingData;
    }
  },

  methods: {
    findLeftSubmissionPhrase(pharseId) {
      const pharseCounter = this.leftAnswers.length;
      for (let i = 0; i < pharseCounter; i++) {
        const tmp = this.leftAnswers[i];
        if (tmp.id == pharseId) {
          return tmp;
        }
      }
      return {};
    },
    findRightSubmissionPhrase(pharseId) {
      const pharseCounter = this.rightAnswers.length;
      for (let i = 0; i < pharseCounter; i++) {
        const tmp = this.rightAnswers[i];
        if (tmp.id == pharseId) {
          return tmp;
        }
      }
      return {};
    },
    get
  },

  mounted() {
  },
};
</script>

<style lang="scss">
</style>
