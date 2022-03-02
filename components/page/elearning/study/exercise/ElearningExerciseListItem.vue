<template>
  <div class="e-exercise-list-item text-center bg-white" :class="classes">
    <h3 class="e-exercise-list-item__name heading-5 mb-3">{{ name }}</h3>
    <div class="e-exercise-list-item__desc mb-3">
      <span v-if="isTest" class="text-primary">{{ type | getTestTypeText }}</span>
      <span v-else class="text-primary">{{ type | getExerciseTypeText }}</span>
      <app-divider class="e-exercise-list-item__divider" direction="vertical" v-if="duration"/>
      <span class="text-gray" v-if="duration">Thời gian:</span>
      <b class="text-dark" v-if="duration">{{ getDurationText(duration) }}</b>
    </div>

    <app-button
      v-if="overDeadline && status === EXERCISE_STATUS.NONE"
      color="secondary"
      size="sm"
      :pointer="false"
      >Quá hạn làm {{ exerciseTextTransform }}</app-button
    >

    <app-button
      v-else-if="!overDeadline && status === EXERCISE_STATUS.NONE && !works"
      color="yellow"
      size="sm"
      @click.prevent="handleDoExercise"
      >Làm {{ exerciseTextTransform }}</app-button
    >

    <app-button
      v-else-if="(status == EXERCISE_STATUS.FAILED || status == EXERCISE_STATUS.NONE) && canDoExercise"
      color="secondary"
      size="sm"
      :pointer="canDoExercise"
      @click.prevent="handleReviewResult"
      >Làm lại {{ exerciseTextTransform }} ({{ reworksTransform }})</app-button
    >

    <app-button
      v-else-if="status === EXERCISE_STATUS.PENDING"
      color="yellow"
      size="sm"
      :pointer="false"
      >Chờ chấm điểm</app-button
    >

    <app-button
      v-else-if="status === EXERCISE_STATUS.PASSED"
      color="primary"
      size="sm"
      @click.prevent="handleReviewResult"
      >Xem kết quả</app-button
    >

    <app-button
      v-else-if="!canDoExercise && status != EXERCISE_STATUS.PASSED"
      color="secondary"
      size="sm"
      @click.prevent="handleReviewResult"
      >Xem kết quả</app-button
    >

    <span v-if="required" class="e-exercise-list-item__star">
      <IconStar class="icon" />
    </span>
  </div>
</template>

<script>
import { EXERCISE_STATUS, EXERCISE_TYPES, STUDY_MODE } from "~/utils/constants";
import { isBeforeNow } from "~/utils/moment";

const IconStar = () => import("~/assets/svg/v2-icons/star_24px.svg?inline");

import { mapMutations, mapActions, mapState } from "vuex";

export default {
  components: {
    IconStar
  },

  props: {
    id: String,
    stared: Boolean,
    name: String,
    result: String,
    deadline: String,
    open_time: String,
    questions: Number,
    duration: Number,
    reworks: Number,
    works: Number,
    required: Boolean,
    status: {
      type: String,
      default: EXERCISE_STATUS.NONE,
      validator: value => Object.values(EXERCISE_STATUS).includes(value)
    },
    type: {
      type: String,
      default: EXERCISE_TYPES.CHOICE,
      validator: value => Object.values(EXERCISE_TYPES).includes(value)
    }
  },

  data() {
    return {
      EXERCISE_STATUS: Object.freeze(EXERCISE_STATUS),
      EXERCISE_TYPES: Object.freeze(EXERCISE_TYPES)
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", ["currentLession"]),

    classes() {
      return {
        "e-exercise-list-item--none": this.status === EXERCISE_STATUS.NONE,
        "e-exercise-list-item--pending":
          this.status === EXERCISE_STATUS.PENDING,
        "e-exercise-list-item--failed": this.status === EXERCISE_STATUS.FAILED,
        "e-exercise-list-item--passed": this.status === EXERCISE_STATUS.PASSED
      };
    },

    canDoExercise() {
      if(!this.reworks) return true;
      return this.works < this.reworks;
    },

    overDeadline() {
      if(!this.deadline) return false;
      return isBeforeNow(this.deadline);
    },

    isTest() {
      return !this.currentLession;
    },

    exerciseTextTransform() {
      if(this.isTest) {
        return "bài kiểm tra";
      } else {
        return "bài tập";
      }
    },

    reworksTransform() {
      return this.reworks ? `${this.works}/${this.reworks}` : 'Không giới hạn';
    }
  },

  methods: {
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseCurrent"
    ]),
    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyExerciseSubmissionList"
    ]),

    ...mapMutations("event", ["setStudyMode"]),

    handleDoExercise() {
      console.log("[handleDoExercise]");

      if(!this.canDoExercise) return;

      // set current exercise
      this.setStudyExerciseCurrent({
        id: this.id,
        name: this.name,
        type: this.type,
        duration: this.duration,
        questions: this.questions,
        result: this.result,
        reworks: this.reworks,
        works: this.works,
        open_time: this.open_time,
        required: this.required
      });

      // show befor begin exercise
      this.setStudyMode(STUDY_MODE.DO_EXERCISE_BEFORE_BEGIN);
    },

    handleReviewResult() {
      console.log("[handleReviewResult]");
      // set current exercise for redo exercise
      this.setStudyExerciseCurrent({
        id: this.id,
        name: this.name,
        type: this.type,
        duration: this.duration,
        questions: this.questions,
        result: this.result,
        reworks: this.reworks,
        works: this.works,
        open_time: this.open_time,
        required: this.required
      });
      // get review result
      this.elearningSudyExerciseSubmissionList({ test_id: this.id});
      // show review result
      this.setStudyMode(STUDY_MODE.REVIEW_EXERCISE_RESULT);
    },

    getDurationText(time) {
      if(!time) return "";

      const hour = Math.floor(time / 60);
      const minute = time % 60;
      return `${hour} giờ ${minute} phút`;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exercise/_elearning-exercise-list-item.scss";
</style>
