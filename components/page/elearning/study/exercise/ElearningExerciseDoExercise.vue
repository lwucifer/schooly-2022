<template>
  <div class="e-exercise-do-exercise">
    <h1 class="heading-3 text-dark-2 mt-3 mb-4 text-center">
      {{ currentExercise.name }} -
      {{ currentExercise.type | getExerciseTypeText }}
    </h1>
    <div class="text-center font-weight-semi-bold heading-5 mb-15">
      <span v-if="studyMode != doingExerciseMode">
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

      <span style="padding-left: 3.6rem;" v-if="currentExercise.required">
        Thời gian còn lại:
        <!-- countdown clock here -->
        <span class="text-secondary e-exercise-do-exercise__countdown">{{
          countdown
        }}</span>
      </span>
      <span style="padding-left: 3.6rem;" v-else>
        Thời gian còn lại:
        <span class="text-secondary e-exercise-do-exercise__countdown"
          >Không giới hạn</span
        >
      </span>
    </div>
    <template v-if="!!currentExerciseQuestion">
      <ElearningExerciseDoExerciseChoice
        v-if="currentExerciseQuestion.type === EXERCISE_TYPES.CHOICE"
        :questionId="currentExerciseQuestion.id"
      />
      <ElearningExerciseDoExerciseEssay
        v-else-if="currentExerciseQuestion.type === EXERCISE_TYPES.ESSAY"
        :questionId="currentExerciseQuestion.id"
      />
    </template>

    
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import { EXERCISE_TYPES, STUDY_MODE } from "~/utils/constants";
import { getCountdown_HH_MM_SS } from "~/utils/common";

import ElearningExerciseDoExerciseChoice from "~/components/page/elearning/study/exercise/ElearningExerciseDoExerciseChoice";
import ElearningExerciseDoExerciseEssay from "~/components/page/elearning/study/exercise/ElearningExerciseDoExerciseEssay";

let interval = null;

export default {
  components: {
    ElearningExerciseDoExerciseChoice,
    ElearningExerciseDoExerciseEssay
  },

  data() {
    return {
      EXERCISE_TYPES: Object.freeze(EXERCISE_TYPES),
      countdown: "--:--:--",
      doingExerciseMode: STUDY_MODE.DO_EXERCISE_DOING,
      
    };
  },

  created() {
    console.log("[created] DoExercise", interval, this.seconds);
    if (interval) {
      clearInterval(interval);
    }
    if (this.seconds) {
      this.setCountdown();
    }
  },

  computed: {
    ...mapState("elearning/study/study-exercise", [
      "currentExercise",
      "currentExerciseQuestion"
    ]),
    ...mapState("event", ["studyMode", "seconds"])
  },

  methods: {
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseAutoSubmission"
    ]),
    ...mapMutations("event", ["setSeconds"]),

    setCountdown() {
      console.log("[setCountdown]", this.seconds);
      // exercise can do forever
      if (!this.currentExercise.duration) return;

      // exercise can do in duration time
      // let seconds = (this.currentExercise.duration) * 60; // in seconds
      // this.setSeconds((this.currentExercise.duration) * 60);
      let seconds = this.seconds; // in seconds
      if (!seconds) return;

      interval = setInterval(() => {
        this.countdown = getCountdown_HH_MM_SS(seconds);
        // console.log("[setCountdown]", seconds, this.countdown);

        // save seconds to storage
        this.setSeconds(seconds);

        if (seconds > 0) {
          seconds -= 1;
        } else {
          // clear interval
          clearInterval(interval);

          // auto submission
          this.setStudyExerciseAutoSubmission(this.currentExercise);
        }
      }, 1000);
    },

  },

  mounted() {
    // this.setCountdown();
  },

  beforeDestroy() {
    console.log("[beforeDestroy] DoExercise", interval);
    // clearInterval(interval);
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exercise/_elearning-exercise-do-exercise.scss";
</style>
