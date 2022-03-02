<template>
  <div class="elearning-exercise-before-v2">
    <div class="eeb__header">
      <button @click="$router.go(-1)">
        <IconArrowBackIos24px class="fill-primary" />
      </button>
      <h4 class="ml-3">{{ currentExercise.name }}</h4>
    </div>
    <div class="eeb__content">
      <ElearningResultPending v-if="currentExercise.result == 'PENDING'" />
      <ElearningResultPassed v-else-if="currentExercise.result == 'PASSED'" />
      <ElearningResultFailed v-else-if="currentExercise.result == 'FAILED' || currentExercise.result == 'NONE'" />
    </div>
  </div>
</template>

<script>
import ElearningResultPending from "~/components/page/elearning/study/v2/exercise/ElearningResultPending";
import ElearningResultPassed from "~/components/page/elearning/study/v2/exercise/ElearningResultPassed";
import ElearningResultFailed from "~/components/page/elearning/study/v2/exercise/ElearningResultFailed";
import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";

import { mapState } from "vuex";


export default {
  components: {
    ElearningResultPending,
    ElearningResultPassed,
    ElearningResultFailed,
    IconArrowBackIos24px
  },
  data() {
    return {
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", [
      "currentExercise",
    ]),
  }
};
</script>

<style></style>
