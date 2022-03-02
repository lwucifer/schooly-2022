<template>
  <div class="container">
    <div
      v-if="$route.query && $route.query.submission_type === UPLOAD_TEST_SUBMISSION_TYPE.MANUAL"
      class="row"
    >
      <div :class="{ 'col-md-12': isExpand, 'col-md-8': !isExpand }">
        <ElearningDoExercise
          @expand="val => (isExpand = val)"
          :isExpand="isExpand"
          @submission="modalConfirmSubmit = true"
        />
      </div>

      <div class="col-md-4" v-if="!isExpand">
        <TimeRemaningSide class="mb-4" @submission="modalConfirmSubmit = true" />
        <ListQuestionSide />
      </div>
    </div>

    <DoTestUpload v-else />

    <app-modal-confirm
      v-if="modalConfirmSubmit"
      title="Xác nhận nộp bài"
      description="Bạn có chắc chắn muốn nộp bài?"
      :confirmLoading="loadingSubmit"
      @cancel="modalConfirmSubmit = false"
      @ok="handleQuestionSubmission"
      @close="modalConfirmSubmit = false"
    ></app-modal-confirm>

    <app-modal-notify
      v-if="notify.isShowNotify"
      :type="notify.type"
      :title="notify.title"
      @close="notify.isShowNotify = false"
      @ok="notify.isShowNotify = false"
    />
  </div>
</template>

<script>
import ElearningDoExercise from "~/components/page/elearning/study/v2/ElearningDoExercise";
import TimeRemaningSide from "~/components/page/elearning/study/v2/TimeRemaningSide";
import ListQuestionSide from "~/components/page/elearning/study/v2/ListQuestionSide";
import DoTestUpload from "~/components/page/elearning/do-test/DoTestUpload";

import { mapState, mapMutations, mapActions } from "vuex";
import {
  STUDY_MODE,
  DO_EXERCISE_STATUS,
  UPLOAD_TEST_SUBMISSION_TYPE,
} from "~/utils/constants";
import { RESPONSE_SUCCESS } from "~/utils/config";
import { get } from "lodash";

let t = null;

export default {
  layout: "do-test",
  components: {
    ElearningDoExercise,
    TimeRemaningSide,
    ListQuestionSide,
    DoTestUpload,
  },

  data() {
    return {
      isExpand: false,
      modalConfirmSubmit: false,
      notify: {
        type: "",
        description: "",
        isShowNotify: false,
      },
      loadingSubmit: false,
    };
  },

  async created() {
    this.UPLOAD_TEST_SUBMISSION_TYPE = Object.freeze(
      UPLOAD_TEST_SUBMISSION_TYPE
    );
    //
    const { test_id = "", submission_type = "" } = this.$route.query || {};
    submission_type === UPLOAD_TEST_SUBMISSION_TYPE.MANUAL &&
      (await this.handleStartDoExercise(test_id));
  },

  computed: {
    ...mapState("elearning/study/study-exercise", [
      "currentExercise",
      "currentLession",
      "submission",
      "autoSubmission",
    ]),
    ...mapState("event", ["studyMode", "minutes"]),
  },

  methods: {
    ...mapMutations("event", [
      "setStudyMode",
      "setDoExerciseStatus",
      "setMinutes",
    ]),
    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyExerciseQuestionList",
      "elearningSudyExerciseQuestionListStart",
      "elearningSudyExerciseSubmissionAdd",
    ]),
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseSubmission",
      "setStudyExerciseQuestionStart",
    ]),

    handleStartDoExercise(test_id) {
      console.log("[handleStartDoExercise]", test_id);
      // show doing exercise
      this.setStudyMode(STUDY_MODE.DO_EXERCISE_DOING);
      //   this.setDoExerciseStatus(DO_EXERCISE_STATUS.DEFAULT);

      this.elearningSudyExerciseQuestionListStart({
        test_id,
      }).then((start) => {
        if (start.success == RESPONSE_SUCCESS) {
          const result = start.data;
          const duration = get(result, "duration", 0);
          // donot auto submission incase optional test
          console.log("[autosubmission] duration", duration);
          if (!!duration) {
            this.setMinutes(duration); // in minutes
            t = setInterval(() => {
              this.setMinutes(get(this, "minutes", 0) - 1 / 60);
            }, 1000);
          }

          // get list question of exercise
          this.elearningSudyExerciseQuestionList({ test_id }).then((res) => {
            if (res.success == RESPONSE_SUCCESS) {
              // sert start question
              this.setStudyExerciseQuestionStart(result);
              // set current test_id
              this.setStudyExerciseSubmission({
                test_id,
              });
            }
          });
        } else {
          this.$toasted.error(start.message);
          this.$router.go(-1);
        }
      });
    },

    handleQuestionSubmission() {
      console.log("[handleQuestionSubmission]", this.submission);
      this.loadingSubmit = true;

      const submissionReq = {
        test_id: this.submission.test_id,
        answers: this.submission.answers,
      };
      console.log("[handleQuestionSubmission] submissionReq", submissionReq);

      this.elearningSudyExerciseSubmissionAdd(submissionReq)
        .then((res) => {
          if (res.success == RESPONSE_SUCCESS) {
            this.setStudyMode(STUDY_MODE.SUBMISSION_SUCCESS);
          } else {
            this.setStudyMode(STUDY_MODE.DEFAULT);
            this.notify = {
              type: "error",
              title: res.message,
              isShowNotify: true,
            };
          }

          this.modalConfirmSubmit = false;
          this.loadingSubmit = false;
        })
        .catch((err) => {
          this.loadingSubmit = fasle;
          this.setStudyMode(STUDY_MODE.DEFAULT);
          this.notify = {
            type: "error",
            title: err,
            isShowNotify: true,
          };
        });
    },
  },

  watch: {
    studyMode(_newVal) {
      if (_newVal == STUDY_MODE.SUBMISSION_SUCCESS) this.isExpand = true;
    },

    minutes(_newVal) {
      if (_newVal <= 0) {
        console.log(
          "[minutes] [autosubmission] clearInterval",
          _newVal,
          new Date()
        );
        clearInterval(t);
        this.handleQuestionSubmission();
      }
    },

    autoSubmission(_newVal) {
      console.log("[autoSubmission] do-test", _newVal);
      this.handleQuestionSubmission();
    },
  },

  beforeDestroy() {
    console.log("[beforeDestroy] do-test");
    this.setStudyMode(STUDY_MODE.DEFAULT);
    clearInterval(t);
  },
};
</script>

<style></style>
