<template>
  <div class="elearning-exercise-before-v2">
    <div class="eeb__header">
      <button @click="$router.go(-1)">
        <IconArrowBackIos24px class="fill-primary" />
      </button>
      <h4 class="ml-3">{{ currentExercise.name }}</h4>
    </div>
    <div class="eeb__content">
      <div class="eeb__submit-wrap">
        <div class="eeb__submit-title">
          <IconCheck24px height="30" width="30" class="fill-primary" />
          <p>Nộp bài thành công</p>
        </div>
        <div class="d-flex mt-4">
          <div class="mr-3">
            <p class="mb-3">Thể loại {{ submissionAdd.category | exCate2Txt }}:</p>
            <p class="mb-3">Thời gian bắt đầu làm bài</p>
            <p class="mb-3">Tổng thời gian làm bài:</p>
            <p>Số câu hỏi:</p>
          </div>
          <div>
            <p class="mb-3">
              {{ submissionAdd.type | getCommonTestTypeText }}
            </p>
            <p class="mb-3">
               {{ submissionAdd.working_start_time | getDateTimeFullText }}
            </p>
            <p class="mb-3">{{ submissionAdd.working_time | formatMMSS }}</p>
            <p class="mb-3">{{ submissionAdd.questions }}</p>
          </div>
        </div>
        <app-button class="btn-back" @click="handleBack"
          >Quay lại</app-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconCheck24px from "~/assets/svg/v2-icons/check_24px.svg?inline";

import { mapState, mapMutations } from "vuex";
import { STUDY_MODE } from "~/utils/constants";


export default {
  components: {
    IconArrowBackIos24px,
    IconCheck24px
  },

  computed: {
    ...mapState("elearning/study/study-exercise", ["currentExercise", "submissionAdd"]),
  },

  methods: {
    ...mapMutations("event", ["setStudyMode"]),

    handleBack() {
      // this.setStudyMode(STUDY_MODE.DO_EXERCISE_DOING);
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-before.scss";
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-result.scss";
</style>
