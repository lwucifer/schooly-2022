<template>
  <div class="elearning-exercise-list-item-v2">
    <div class="exercise-require" v-if="exercise.required">
      <IconExerciseRequired />
    </div>
    <div class="row">
      <div class="col-md-9 eeliv-left">
        <h5>{{ exercise.name }}</h5>
        <div class="eeliv-content">
          <div class="d-flex flex-column eeliv-content__left">
            <!-- <span class="mb-2"
              >Thể loại:<span class="ml-3">{{
                exercise.type | getCommonTestTypeText
              }}</span></span
            >
            <span
              >Số câu hỏi: <span class="">{{ exercise.questions }}</span></span
            > -->
            <div class="d-flex mb-2">
              <div class="item-title">Thể loại :</div>
              <div>{{
                exercise.type | getCommonTestTypeText
              }}</div>
            </div>
            <div class="d-flex">
              <div class="item-title">Số câu hỏi :</div>
              <div>{{ exercise.questions }}</div>
            </div>
          </div>
          <div class="d-flex flex-column eeliv-content__right">
            <!-- <span class="mb-2">
              Số lần làm bài tối đa:
              <span class="">{{ exercise.reworks || 'Không giới hạn' }}</span></span
            >
            <span
              >Thời gian làm bài:
              <span class="">{{ exercise.duration }} phút</span></span
            > -->
            <div class="d-flex mb-2">
              <div class="item-title">Số lần làm bài tối đa:</div>
              <div>{{
                exercise.reworks || 'Không giới hạn'
              }}</div>
            </div>
            <div class="d-flex">
              <div class="item-title">Thời gian làm bài:</div>
              <div>{{ exercise.duration }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div
          class="w-100 d-flex flex-column align-items-center justify-content-center"
          v-if="exercise.result == EXERCISE_STATUS.PASSED"
        >
          <p class="font-weight-medium text-success">{{ markResult }} (Đạt)</p>
          <app-button
            class="w-100 mt-3"
            size="sm"
            @click.prevent="handleReviewResult"
          >
            Xem kết quả
          </app-button>
        </div>
        <div
          class="w-100 d-flex flex-column align-items-center justify-content-center"
          v-else-if="
            !canDoExercise && exercise.result != EXERCISE_STATUS.PASSED
          "
        >
          <p class="font-weight-medium text-pink-2">
            {{ markResult }} (Chưa Đạt)
          </p>
          <app-button
            class="w-100 mt-3 btn-result__fail"
            size="sm"
            @click.prevent="handleReviewResult"
          >
            Xem đáp án
          </app-button>
        </div>
        <div
          class="w-100 d-flex flex-column align-items-center justify-content-center"
          v-else-if="overDeadline"
        >
          <p class="font-weight-medium text-pink-2">
            {{ markResult }} (Không Đạt)
          </p>
          <app-button
            class="w-100 mt-3 btn-result__fail"
            size="sm"
            :pointer="false"
          >
            Qúa hạn làm bài
          </app-button>
        </div>
        <div
          class="w-100 d-flex flex-column align-items-center justify-content-center"
          v-else-if="exercise.result == EXERCISE_STATUS.PENDING"
        >
          <IconMoreHoriz24px class="fill-pending" />
          <app-button
            class="w-100 mt-1"
            size="sm"
            color="yellow"
            :pointer="false"
          >
            Chờ chấm
          </app-button>
        </div>
        <div
          class="w-100 d-flex flex-column align-items-center justify-content-center"
          v-else-if="
            !overDeadline &&
              exercise.result === EXERCISE_STATUS.NONE &&
              canDoExercise && !exercise.works
          "
        >
          <IconEdit class="fill-primary" />
          <app-button
            class="w-100 mt-3"
            size="sm"
            color="white"
            @click.prevent="handleDoExercise"
          >
            Làm bài
          </app-button>
        </div>
        <div
          class="w-100 d-flex flex-column align-items-center justify-content-center"
          v-else-if="
            (exercise.result == EXERCISE_STATUS.FAILED ||
              exercise.result == EXERCISE_STATUS.NONE) &&
              canDoExercise
          "
        >
          <p class="font-weight-medium text-pink-2">
            {{ markResult }} (Chưa Đạt)
          </p>
          <app-button
            class="w-100 mt-3 btn-result__fail"
            size="sm"
            @click.prevent="handleReviewResult"
          >
            Làm lại ({{ reworksTransform }})
          </app-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconMoreHoriz24px from "~/assets/svg/v2-icons/more_horiz_24px.svg?inline";
import IconEdit from "~/assets/svg/icons/edit.svg?inline";
import IconExerciseRequired from "~/assets/svg/icons/exercise-required.svg?inline";


import { EXERCISE_STATUS, EXERCISE_TYPES, STUDY_MODE } from "~/utils/constants";
import { isBeforeNow } from "~/utils/moment";
import { mapMutations, mapActions, mapState } from "vuex";

export default {
  components: {
    IconMoreHoriz24px,
    IconEdit,
    IconExerciseRequired
  },

  props: {
    exercise: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      EXERCISE_STATUS: Object.freeze(EXERCISE_STATUS),
      EXERCISE_TYPES: Object.freeze(EXERCISE_TYPES)
    };
  },

  computed: {
    canDoExercise() {
      if (!this.exercise.reworks) return true;
      if (!this.exercise.works) return true;
      return this.exercise.works < this.exercise.reworks;
    },

    overDeadline() {
      if (!this.exercise.deadline) return false;
      return isBeforeNow(this.exercise.deadline);
    },

    reworksTransform() {
      return this.exercise.reworks
        ? `${this.exercise.works}/${this.exercise.reworks}`
        : "Không giới hạn";
    },

    markResult() {
      return `${this.exercise.mark || 0}/${this.exercise.max_score}`;
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

      if (!this.canDoExercise) return;

      // set current exercise
      this.setStudyExerciseCurrent(this.exercise);

      // show befor begin exercise
      this.setStudyMode(STUDY_MODE.DO_EXERCISE_BEFORE_BEGIN);
    },

    handleReviewResult() {
      console.log("[handleReviewResult]", this.exercise);
      // set current exercise for redo exercise
      this.setStudyExerciseCurrent(this.exercise);
      // get review result
      this.elearningSudyExerciseSubmissionList({ test_id: this.exercise.id });
      // show review result
      this.setStudyMode(STUDY_MODE.REVIEW_EXERCISE_RESULT);
    },

  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-list.scss";
</style>
