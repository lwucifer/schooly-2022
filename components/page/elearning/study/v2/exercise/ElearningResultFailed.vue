<template>
  <div class="elearning-result-fail">
    <div class="erp__title">
      <div>
        <span>Kết quả làm bài:</span>
        <span class="text-pink-2 heading-3 font-weight-medium">{{
          markResult
        }}</span>
        <span class="text-pink-2 heading-5 font-weight-medium"
          >(Không đạt)</span
        >
      </div>
    </div>
    <div class="d-flex mt-4">
      <div class="mr-3">
        <p class="mb-3">Thể loại bài tập:</p>
        <p class="mb-3">Thời gian bắt đầu làm bài:</p>
        <p class="mb-3">Tổng thời gian làm bài:</p>
        <p class="mb-3">Số câu hỏi:</p>
        <p class="mb-3" v-if="submissions.type == 'CHOICE'">
          Số đáp án đúng:
        </p>
        <p class="mb-3" v-if="submissions.type == 'CHOICE'">Bỏ qua:</p>
      </div>
      <div>
        <p class="text-dark mb-3">
          {{ submissions.type | getCommonTestTypeText }}
        </p>
        <p class="text-dark mb-3">
          {{ submissions.start_time | getDateTimeFullText }}
        </p>
        <!-- <p class="text-dark mb-3">
          {{ submissions.duration | formatMMSS }}
        </p> -->
        <p class="text-dark mb-3">
          {{ submissions.working_time | formatMMSS }}
        </p>
        <p class="text-dark mb-3">{{ submissions.questions }}</p>
        <p class="text-dark mb-3" v-if="submissions.type == 'CHOICE'">
          {{ submissions.corrects }}
        </p>
        <p class="text-dark mb-3" v-if="submissions.type == 'CHOICE'">
          {{ submissions.ignores }}
        </p>
      </div>
    </div>
    <div class="d-flex align-items-center mt-4">
      <app-button
        class="btn-back"
        color="pink"
        v-if="canRework"
        @click="handleRework"
        >Làm lại bài tập</app-button
      >
      <app-button class="btn-back" color="pink" v-else @click="handleShowResult" :loading="loading"
        >Xem đáp án</app-button
      >
      <span class="text-pink-2"
        >*Số lần làm bài còn lại: {{ remainWorks }}</span
      >
    </div>
    <ModalExerciseResult v-if="isShowModal" @close="isShowModal = false" />
  </div>
</template>

<script>
import ModalExerciseResult from "~/components/page/elearning/study/v2/exercise/ModalExerciseResult";

import { mapState, mapActions, mapMutations } from "vuex";
import { EXERCISE_STATUS, EXERCISE_TYPES, STUDY_MODE } from "~/utils/constants";
import { RESPONSE_SUCCESS } from "~/utils/config";

export default {
  components: {
    ModalExerciseResult
  },
  data() {
    return {
      isShowModal: false,
      EXERCISE_STATUS: Object.freeze(EXERCISE_STATUS),
      EXERCISE_TYPES: Object.freeze(EXERCISE_TYPES),
      loading: false,
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", ["submissions"]),

    markResult() {
      return `${this.submissions.mark || 0}/${this.submissions.max_score}`;
    },

    remainWorks() {
      return !this.submissions.works
        ? "Không giới hạn"
        : (this.submissions.works || 0) - (this.submissions.exams || 0);
    },

    canRework() {
      return (
        (this.submissions.status == EXERCISE_STATUS.FAILED ||
          this.submissions.status == EXERCISE_STATUS.NONE) &&
        this.canDoExercise
      );
    },

    canDoExercise() {
      if (!this.submissions.works) return true;
      if (!this.submissions.exams) return true;
      return this.submissions.exams < this.submissions.works;
    }
  },

  methods: {
    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyExerciseQuestionList"
    ]),

    ...mapMutations("event", ["setStudyMode"]),

    handleRework() {
      console.log("[handleRework]", this.submissions);
      const elearning_id = this.$route.params.id;
      const doExerciseurl = `/elearning/do-test?test_id=${this.submissions.test_id}&submission_type=${this.submissions.submission_type}`;
      this.$router.push(doExerciseurl);
    },

    handleShowResult() {
      console.log("[handleShowResult]");
      this.loading = true;
      const test_id = this.submissions.test_id;
      this.elearningSudyExerciseQuestionList({ test_id }).then(res => {
        this.loading = false;
        this.isShowModal = true;
      });
    }
  },

  watch: {
    // submissions(_newVal) {
    //   console.log("[submissions] watch", _newVal);
    // }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-result.scss";
</style>
