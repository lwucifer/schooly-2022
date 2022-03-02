<template>
  <div class="e-exercise py-0 px-0 bg-white">
    <div class="e-exercise-components" v-if="!loadingExercise">
      <ElearningExerciseList v-if="studyMode == studyModeDoExercise" />
      <ELearningExerciseBeforeBegin v-else-if="studyMode == beforeBeginMode" />
      <ElearningExerciseSubmitSuccess v-else-if="studyMode == submissionMode"/>
      <ElearningExerciseResults v-else-if="studyMode == reviewMode" />
      <!-- <ElearningExerciseDoExercise v-else-if="studyMode == doingMode" /> -->
      <!-- <ElearningExerciseResults v-else-if="studyMode == reviewMode" /> -->
    </div>

    <div class="text-center w-100 pt-md" v-if="loadingExercise">
      <app-spin />
    </div>

    <app-modal-notify
      v-if="notify.isShowNotify"
      type="success"
      title="Chúc mừng bạn đã hoàn thành bài tập"
      @close="notify.isShowNotify = false"
      @ok="notify.isShowNotify = false"
    />

  </div>
</template>

<script>
import IconCropLandscape from "~/assets/svg/v2-icons/crop_landscape_24px.svg?inline";
import IconCropFree from "~/assets/svg/v2-icons/crop_free_24px.svg?inline";

import ElearningExerciseList from "~/components/page/elearning/study/v2/exercise/ElearningExerciseList";
import ELearningExerciseBeforeBegin from "~/components/page/elearning/study/v2/exercise/ELearningExerciseBeforeBegin";
import ElearningExerciseSubmitSuccess from "~/components/page/elearning/study/v2/exercise/ElearningExerciseSubmitSuccess";
// import ElearningExerciseDoExercise from "~/components/page/elearning/study/exercise/ElearningExerciseDoExercise.vue";
import ElearningExerciseResults from "~/components/page/elearning/study/v2/exercise/ElearningExerciseResults";

import { mapState } from "vuex";
import { STUDY_MODE, DO_EXERCISE_STATUS } from "~/utils/constants";
import { ELEARNING_STUDY as ELEARNING_STUDY_MUTATION } from "~/utils/mutation-types";

export default {
  data() {
    return {
      studyModeDoExercise: STUDY_MODE.DO_EXERCISE,
      beforeBeginMode: STUDY_MODE.DO_EXERCISE_BEFORE_BEGIN,
      doingMode: STUDY_MODE.DO_EXERCISE_DOING,
      reviewMode: STUDY_MODE.REVIEW_EXERCISE_RESULT,
      submissionMode: STUDY_MODE.SUBMISSION_SUCCESS,
      notify: {
        type: "",
        description: "",
        isShowNotify: false
      },
    };
  },

  components: {
    // icons
    IconCropLandscape,
    IconCropFree,
    // components
    ElearningExerciseList,
    ELearningExerciseBeforeBegin,
    ElearningExerciseSubmitSuccess,
    ElearningExerciseResults
    // ElearningExerciseDoExercise,
  },

  computed: {
    ...mapState("event", ["studyMode", "loadingExercise", "doExerciseStatus"]),
    // ...mapState("elearning/study/study", ["expand"]),
  },

  watch: {
    studyMode(_newVal) {
      console.log("[studyMode] watch", _newVal);
    },
    doExerciseStatus(_newVal) {
      this.notify.isShowNotify = _newVal == DO_EXERCISE_STATUS.SUBMISSION_DONE
    }
  },

  created() {
    // console.log("[created] ElearningExercise")
  }

};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exercise/_elearning-exercise.scss";
.bg-white{
  background: #ffffff !important;
}
</style>
