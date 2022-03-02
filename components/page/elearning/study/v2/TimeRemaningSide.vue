<template>
  <div class="time-remaining-side">
    <h4 class="time-remaining-side__title">Thời gian làm bài còn lại</h4>

    <div class="time-remaining-side__content">
      <div class="count-time d-flex justify-content-between align-items-center">
        <div class="time">
          <p>{{ countdowns[0] }}</p>
          <p>Giờ</p>
        </div>

        <div class="time">
          <p>{{ countdowns[1] }}</p>
          <p>Phút</p>
        </div>

        <div class="time">
          <p>{{ countdowns[2] }}</p>
          <p>Giây</p>
        </div>
      </div>

      <app-button
        fullWidth
        class="submit-send"
        @click.prevent="$emit('submission')"
      >
        <IconSend class="icon mr-2" /> NỘP BÀI
      </app-button>
    </div>

  </div>
</template>

<script>
import IconSend from "~/assets/svg/v2-icons/send_24px.svg?inline";

import { mapState, mapActions, mapMutations } from "vuex";
import { formatCountdown } from "~/utils/moment";
import { RESPONSE_SUCCESS } from "~/utils/config";
import { get } from "lodash";

import {
  EXERCISE_TYPES,
  STUDY_MODE,
  EXERCISE_CATEGORIES,
  PAGE_SIZE,
  DO_EXERCISE_STATUS,
  QUESTION_NAV
} from "~/utils/constants";

export default {
  components: {
    IconSend
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", [
      "currentExercise",
      "submission"
    ]),
    ...mapState("event", ["minutes"]),

    countdowns() {
      const duration = get(this, "minutes", 0);
      const str = formatCountdown(duration).split("-");
      return str;
    }
  },

  methods: {
    ...mapActions("elearning/study/study-progress", [
      "elearningSudyProgressList"
    ]),

    ...mapMutations("event", ["setStudyMode", "setDoExerciseStatus"]),

    getDurationToEndTimee() {},
    formatCountdown
  },

  // watch: {
  //   minutes(_newVal) {
  //     // console.log("[minutes] watch [autosubmission]", _newVal);
  //     if (_newVal <= 0) {
  //       this.$emit('submission');
  //     }
  //   },
  // }
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/exams/_time-remaining-side.scss";
</style>
