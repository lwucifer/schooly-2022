<template>
  <div class="e-exercise-results">
    <h1 class="heading-3 text-dark-2 mt-3 mb-4 text-center" v-if="isTest">
      {{ result.name }} - {{ result.type | getTestTypeText }}
    </h1>
    <h1 class="heading-3 text-dark-2 mt-3 mb-4 text-center" v-else>
      {{ result.name }} - {{ result.type | getExerciseTypeText }}
    </h1>

    <div class="text-center font-weight-semi-bold heading-5 mb-15">
      <template v-if="result.result === EXERCISE_STATUS.PASSED">
        Kết quả làm bài:
        <span class="text-primary">{{ resultRate }}</span>
      </template>

      <template v-else>
        <span>
          Kết quả làm bài:
          <span class="text-secondary mr-6">{{ resultRate }}</span>
        </span>
        <span>
          Số lần làm còn lại:
          <span class="text-secondary">
            {{ reworksTransform }}
          </span>
        </span>
      </template>

      <!-- <span class="d-inline-flex align-items-center text-primary">
        <IconCheckCircleOutline class="icon heading-3 fill-opacity-1 mr-3" />
        <b>Nộp bài thành công</b>
      </span>-->
    </div>

    <div class="e-exercise-results__pane mb-4">
      <div class="row">
        <div class="col-5">Thời gian bắt đầu làm bài</div>
        <div class="col-7">
          {{ result.start_time | getDateTimeFullText | capitalizeFirstLetterOfString }}
        </div>
      </div>
      <div class="row">
        <div class="col-5">Tổng thời gian làm bài</div>
        <div class="col-7">{{ result.working_time | formatMMSS }}</div>
      </div>
      <div class="row">
        <div class="col-5">Số câu hỏi</div>
        <div class="col-7">{{ result.questions }}</div>
      </div>
      <div class="row">
        <div class="col-5">Số đáp án đúng</div>
        <div class="col-7">{{ result.corrects }}</div>
      </div>
      <div class="row">
        <div class="col-5">Bỏ qua</div>
        <div class="col-7">{{ result.ignores }}</div>
      </div>
    </div>

    <div class="text-center">
      <app-button
        v-if="
          result.result === EXERCISE_STATUS.PASSED ||
            result.reworks == result.works
        "
        @click.prevent="handleShowComment"
        >{{ btnTextView }}</app-button
      >
      <app-button
        v-else-if="(result.result === EXERCISE_STATUS.FAILED || result.result === EXERCISE_STATUS.NONE) && isReworkable"
        @click.prevent="handleDoExercise"
        >Làm lại {{ exerciseTextTransform }}</app-button
      >
    </div>

    <app-modal
      v-if="modalListQuestions"
      title="Xem đáp án"
      :footer="false"
      @close="modalListQuestions = false"
    >
      <ElearningExerciseListQuestions slot="content" :isAnswer="isAnswer" />
    </app-modal>

    <app-modal
      v-if="modalComments"
      title="Xem nhận xét"
      :footer="false"
      @close="modalComments = false"
    >
      <ElearningExerciseComments slot="content" />
    </app-modal>
  </div>
</template>

<script>
import { EXERCISE_TYPES, EXERCISE_STATUS, STUDY_MODE } from "~/utils/constants";
import { getExerciseResultText } from "~/plugins/filters";
import { mapActions, mapMutations } from "vuex";

import { mapState } from "vuex";
import { RESPONSE_SUCCESS } from "~/utils/config";
const IconCheckCircleOutline = () =>
  import("~/assets/svg/v2-icons/check_circle_outline_24px.svg?inline");
const ElearningExerciseListQuestions = () =>
  import(
    "~/components/page/elearning/study/exercise/ElearningExerciseListQuestions"
  );
const ElearningExerciseComments = () =>
  import(
    "~/components/page/elearning/study/exercise/ElearningExerciseComments.vue"
  );

export default {
  components: {
    IconCheckCircleOutline,
    ElearningExerciseListQuestions,
    ElearningExerciseComments
  },

  data() {
    return {
      EXERCISE_STATUS: Object.freeze(EXERCISE_STATUS),
      EXERCISE_TYPES: Object.freeze(EXERCISE_TYPES),
      modalListQuestions: false,
      isAnswer: true,
      modalComments: false
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", ["result", "currentLession"]),

    resultRate() {
      return `${this.result.mark || 0}/${this.result.max_score ||
        0} (${getExerciseResultText(this.result.result)})`;
    },

    btnTextView() {
      const exerciseType = this.result.type;
      if (exerciseType == EXERCISE_TYPES.CHOICE) {
        return "Xem đáp án";
      } else if (exerciseType == EXERCISE_TYPES.ESSAY) {
        return "Xem nhận xét";
      }
    },

    isTest() {
      return !this.currentLession;
    },

    exerciseTextTransform() {
      if (this.isTest) {
        return "bài kiểm tra";
      } else {
        return "bài tập";
      }
    },

    reworksTransform() {
      return this.result.reworks
        ? `${this.result.reworks - this.result.works}/${this.result.reworks}`
        : "Không giới hạn";
    },

    isReworkable() {
      if (!this.result.reworks) return true;
      return this.result.reworks > this.result.works;
    }
  },

  methods: {
    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyExerciseSubmissionList"
    ]),
    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyExerciseQuestionList"
    ]),

    ...mapMutations("event", ["setStudyMode"]),

    handleShowComment() {
      console.log("[handleShowComment]");
      const test_id = this.result.id;
      const exerciseType = this.result.type;

      this.elearningSudyExerciseSubmissionList({
        params: {
          exercise_id: test_id
        }
      }).then(res => {
        this.elearningSudyExerciseQuestionList({ test_id }).then(result => {
          if (res.success == RESPONSE_SUCCESS) {
            if (exerciseType == EXERCISE_TYPES.CHOICE) {
              this.modalListQuestions = true;
            } else if (exerciseType == EXERCISE_TYPES.ESSAY) {
              this.modalComments = true;
            }
          }
        });
      });
    },

    handleDoExercise() {
      console.log("[handleDoExercise]");
      // show befor begin exercise
      this.setStudyMode(STUDY_MODE.DO_EXERCISE_BEFORE_BEGIN);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exercise/_elearning-exercise-results.scss";
</style>
