<template>
  <div class="e-exercise-before-begin text-center">
    <h1 class="heading-3 text-dark-2 mt-3 mb-4" v-if="isTest">
      {{ currentExercise.name }} -
      {{ currentExercise.type | getTestTypeText }}
    </h1>
    <h1 class="heading-3 text-dark-2 mt-3 mb-4" v-else>
      {{ currentExercise.name }} -
      {{ currentExercise.type | getExerciseTypeText }}
    </h1>
    <div class="text-center font-weight-semi-bold heading-5 mb-6">
      <span>
        Số câu hỏi:
        <span class="text-secondary mr-6">{{ currentExercise.questions }}</span>
      </span>
      <span v-if="currentExercise.required">
        Thời gian làm bài:
        <span class="text-secondary">{{ currentExercise.duration }} phút</span>
      </span>
      <span v-else>
        Thời gian làm bài:
        <span class="text-secondary">Không giới hạn</span>
      </span>
    </div>

    <div
      class="text-center font-weight-semi-bold heading-5 mb-6"
      v-if="currentExercise.open_time"
    >
      <span>
        Thời gian mở đề:
        <span class="text-secondary">{{
          currentExercise.open_time | fullDateTimeSlash
        }}</span>
      </span>
    </div>

    <app-button @click.prevent="handleStartDoExercise" v-if="isShowBtnStart"
      >Bắt đầu làm bài</app-button
    >
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { STUDY_MODE, DO_EXERCISE_STATUS } from "~/utils/constants";
import { RESPONSE_SUCCESS } from "~/utils/config";
import { fullDateTimeSlash } from "~/utils/moment";
import { getParamQuery } from '~/utils/common';

export default {
  computed: {
    ...mapState("elearning/study/study-exercise", ["currentExercise", "currentLession"]),

    isShowBtnStart() {
      if (!this.currentExercise.open_time) return true;
      const openTime = fullDateTimeSlash(this.currentExercise.open_time);

      console.log(
        "[isShowBtnStart]",
        this.currentExercise,
        openTime,
        new Date()
      );
      return new Date().getTime() >= new Date(openTime).getTime();
    },

    isTest() {
      return !this.currentLession;
    },

  },


  methods: {
    ...mapMutations("event", ["setStudyMode", "setSeconds", "setDoExerciseStatus"]),
    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyExerciseQuestionList",
      "elearningSudyExerciseQuestionListStart"
    ]),
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseSubmission",
      "setStudyExerciseQuestionStart"
    ]),

    handleStartDoExercise() {
      console.log("[handleStartDoExercise]", this.currentExercise);
      // show doing exercise
      this.setSeconds((this.currentExercise.duration) * 60); // in seconds
      this.setStudyMode(STUDY_MODE.DO_EXERCISE_DOING);
      this.setDoExerciseStatus(DO_EXERCISE_STATUS.DEFAULT);

      this.elearningSudyExerciseQuestionListStart({
        test_id: this.currentExercise.id
      }).then(start => {
        if (start.success == RESPONSE_SUCCESS) {
          // start set seconds to event/seconds

          // get list question of exercise
          this.elearningSudyExerciseQuestionList({
            test_id: this.currentExercise.id
          }).then(res => {
            if (res.success == RESPONSE_SUCCESS) {
              // sert start question
              this.setStudyExerciseQuestionStart();
            }
          });

          // set start_time of submission
          this.setStudyExerciseSubmission({
            start_time: new Date(),
            exercise_id: this.currentExercise.id
          });
        }
      });
    }
  }
};
</script>
