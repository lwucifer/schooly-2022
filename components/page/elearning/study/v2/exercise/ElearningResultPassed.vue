<template>
  <div class="elearning-result-pass">
    <div class="erp__title">
      <div>
        <span>Kết quả làm bài:</span>
        <span class="text-success heading-3 font-weight-medium">{{
          markResult
        }}</span>
        <span class="text-success heading-5 font-weight-medium">(Đạt)</span>
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
          {{ submissions.submission_time | getDateTimeFullText }}
        </p>
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
    <!-- <app-button class="btn-back" @click="showModalAnswer" v-if="comment"
      >Xem nhận xét</app-button
    > -->
    <app-button class="btn-back" @click="handleShowResult" :loading="loading"
      >Xem đáp án</app-button
    >
    <ModalExerciseResult v-if="isShowModal" @close="isShowModal = false" />
  </div>
</template>

<script>
import ModalExerciseResult from "~/components/page/elearning/study/v2/exercise/ModalExerciseResult";

import { mapState, mapActions } from "vuex";

export default {
  components: {
    ModalExerciseResult
  },
  data() {
    return {
      isShowModal: false,
      loading: false,
    };
  },
  computed: {
    ...mapState("elearning/study/study-exercise", ["submissions"]),

    markResult() {
      return `${this.submissions.mark || 0}/${this.submissions.max_score}`;
    },
  },
  methods: {
    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyExerciseQuestionList"
    ]),

    showModalAnswer() {
      this.isShowModal = true;
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
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-result.scss";
</style>
