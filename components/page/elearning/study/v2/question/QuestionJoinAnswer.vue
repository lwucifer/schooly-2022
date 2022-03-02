<template>
  <div class="elearning-question-type">
    <div class="eqt__content-question">
      <div>
        <span>{{ currentExerciseQuestion.index }}</span>
      </div>
      <span v-html="currentExerciseQuestion.manual.content"></span>
    </div>
    <div class="eqt__content-answer">
      <div class="row">
        <div class="col-md-6 ">
          <div
            class="question-join-answer_item-left"
            v-for="(item, index) in leftAnswers"
            :key="index"
          >
            <app-dropdown
              position="top"
              class="w-100 tooltip-answer"
            >
              <div slot="activator" class="d-flex">
                <div><span style="width:2rem;display:block">{{item.contentIndex}} .</span></div>
                <div 
                  class="item-content" 
                  v-html="item.content"
                ></div>
              </div>
              <template>
                <div class="pa-3 d-flex tooltip-answer__content">
                  <div><span style="width:2rem;display:block">{{item.contentIndex}} .</span></div>
                  <div class="dont-break-out" v-html="item.content"></div>
                </div>
              </template>
            </app-dropdown>
          </div>
          <!-- <button class="question-join-answer_item-left">
            1. Một vật khi đứng im sẽ chịu tác động của
          </button> -->
        </div>
        <div class="col-md-6">
          <draggable
            @end="onEnd"
            draggable=".question-join-answer_item-right"
            :list="rightAnswers"
          >
            <!-- <transition-group> -->
            <div
              class="question-join-answer_item-right"
              v-for="(item, index) in rightAnswers"
              :key="index"
            >
                <app-dropdown
                  position="top"
                  class="w-100 tooltip-answer"
                >
                <div slot="activator" class="d-flex">
                  <div><span style="width:2rem;display:block">{{item.contentIndex}} .</span></div>
                  <div 
                    class="item-content" 
                    v-html="item.content"
                  ></div>
                </div>
                <template>
                  <div class="pa-3 d-flex tooltip-answer__content">
                    <div><span style="width:2rem;display:block">{{item.contentIndex}} .</span></div>
                    <div class="dont-break-out" v-html="item.content"></div>
                  </div>
                </template>
                </app-dropdown>
            </div>
            <!-- </transition-group> -->
          </draggable>
          <!-- <button class="question-join-answer_item-right">
            1. Một vật khi đứng im sẽ chịu tác động của
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { get } from "lodash";
import draggable from "vuedraggable";
import { QUESTION_ANSWER_INDEX_TEXT } from "~/utils/config";

export default {
  props: {
    questionChange: {
      type: Number,
      default: 0
    }
  },

  components: {
    draggable
  },

  data() {
    return {
      answer: null,
      rightAnswers: []
      // QUESTION_ANSWER_INDEX_TEXT: QUESTION_ANSWER_INDEX_TEXT
    };
  },
  computed: {
    ...mapState("elearning/study/study-exercise", [
      "currentExerciseQuestion",
      "currentExerciseAnswers"
    ]),

    leftAnswers() {
      return get(this, "currentExerciseQuestion.short_answers", [])
        .filter(item => item.name == "answer")
        .map((m, index) => {
          return {
            ...m,
            contentIndex: `${QUESTION_ANSWER_INDEX_TEXT[index]}`
          };
        });
    }
  },

  methods: {
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseSubmission"
    ]),

    setAnswered() {
      console.log(
        "[setAnswered]",
        this.questionChange,
        this.currentExerciseQuestion,
        this.currentExerciseAnswers
      );
      const ans = this.currentExerciseAnswers.find(
        c => c.question_id == this.currentExerciseQuestion.id
      );
      if (!ans || ans.length < 1) {
        this.rightAnswers = get(
          this,
          "currentExerciseQuestion.short_answers",
          []
        )
          .filter(item => item.name == "matching")
          .map((m, index) => {
            return {
              ...m,
              contentIndex: `${QUESTION_ANSWER_INDEX_TEXT[index]}`
            };
          });
      } else {
        let tmp = [];
        ans.submissions.map(m => {
          const matchingObj = get(
            this,
            "currentExerciseQuestion.short_answers",
            []
          ).find(ma => ma.id == m.matching_answer_id);
          tmp.push(matchingObj);
        });
        this.rightAnswers = tmp.map((m, index) => {
          return {
            ...m,
            contentIndex: `${QUESTION_ANSWER_INDEX_TEXT[index]}`
          };
        });
      }
    },

    onEnd(event) {
      console.log("[onEnd]", this.rightAnswers, this.leftAnswers);

      let answers = [];
      this.leftAnswers.map((l, index) => {
        const selected_answer_id = l.id;
        const matching_answer_id = this.rightAnswers[index].id;
        answers.push({
          question_id: this.currentExerciseQuestion.id,
          selected_answer_id,
          matching_answer_id,
          type: this.currentExerciseQuestion.type
        });
      });
      console.log("[onEnd] answers", answers);
      this.setStudyExerciseSubmission({ answers });
    }
  },

  mounted() {},

  watch: {
    questionChange: {
      immediate: true,
      handler(_newVal, _oldVal) {
        console.log("[questionChange] watch Matching", _newVal);
        this.setAnswered();
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-question.scss";
@import "~assets/scss/components/course/create/_create-exercise.scss";
</style>
