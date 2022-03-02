<template>
  <div class="elearning-result-pending">
    <div class="erp__title">
      <div>
        <span>Kết quả làm bài:</span>
        <span class="text-warning heading-3 font-weight-medium"
          >Chờ chấm điểm</span
        >
      </div>
    </div>
    <div class="d-flex mt-4">
      <div class="mr-3">
        <p class="mb-3">Thể loại bài tập:</p>
        <p class="mb-3">Thời gian bắt đầu làm bài:</p>
        <p class="mb-3">Tổng thời gian làm bài:</p>
        <p class="mb-3">Số câu hỏi:</p>
      </div>
      <div>
        <p class="text-dark mb-3">
          {{ currentExercise.type | getCommonTestTypeText }}
        </p>
        <p class="text-dark mb-3">{{ currentExercise.submission_time | getDateTimeFullText }}</p>
        <p class="text-dark mb-3">{{ currentExercise.duration | formatMMSS }}</p>
        <p class="text-dark mb-3">{{ currentExercise.questions }}</p>
      </div>
    </div>
    <app-button class="btn-back">Quay lại</app-button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("elearning/study/study-exercise", ["currentExercise"])
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-result.scss";
</style>
