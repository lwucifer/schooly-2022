<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div class="d-inline-flex align-items-center">
        <div>
          Câu hỏi số
          <app-select
            v-model="questionNo"
            class="ml-3"
            :options="questionNoOpts"
            size="sm"
            @change="handleChangedQuestionNumber"
          />
        </div>
        <div class="ml-4">
          <a
            v-if="currentExerciseQuestion.file_url"
            :href="currentExerciseQuestion.file_url"
            download
            class="text-decoration-none d-inline-flex"
            target="_blank"
          >
            <IconCloudDownload24px class="icon fill-opacity-1 body-1 mr-2" />Tải
            câu hỏi
          </a>

          <!-- <IconFormatListNumbered24px
            class="ext-decoration-none text-clickable"
            @click.prevent="handleShowListQuestion"
          /> -->

        </div>
      </div>

      <IconFormatListNumbered24px
        class="ext-decoration-none text-clickable"
        @click.prevent="handleShowListQuestion"
      />

      <!-- <a
        href
        class="text-decoration-none ml-5"
        @click.prevent="handleShowListQuestion"
        >Danh sách câu hỏi</a
      > -->
    </div>

    <div class="e-exercise-choose bg-white pa-3 mb-4">
      <h3
        class="e-exercise-choose__question heading-6 mb-15"
        v-html="currentExerciseQuestion.content"
      ></h3>
      <app-radio-group
        v-model="answer"
        class="e-exercise-choose__answers d-flex flex-column align-items-start"
      >
        <app-radio
          v-for="(ans, index) in currentExerciseQuestion.answers"
          :key="index"
          :value="ans.id"
          :checked="ans.id == answer"
          >{{ ans.content }}</app-radio
        >
        <!-- <app-radio>Đáp án số 2</app-radio>
        <app-radio>Đáp án số 3</app-radio>
        <app-radio :value="3">Đáp án số 4</app-radio>-->
      </app-radio-group>
    </div>

    <div class="d-flex">
      <div class="d-flex mr-auto">
        <app-button
          size="sm"
          color="default"
          class="mr-4"
          @click.prevent="handleQuestionBack"
          :disabled="isDisableBack"
        >
          <IconArrowBack class="icon fill-opacity-1 body-1 mr-2" />Quay lại
        </app-button>
        <app-button
          size="sm"
          @click.prevent="handleQuestionContinue"
          :disabled="isDisableNext"
        >
          Tiếp tục
          <IconArrowForward class="icon fill-opacity-1 body-1 ml-2" />
        </app-button>
      </div>

      <app-button
        size="sm"
        color="info"
        @click.prevent="modalConfirmSubmit = true"
      >
        <!-- <app-button size="sm" color="info" @click="modalConfirmSubmit = true"> -->
        <IconSend class="icon body-1 mr-2" />Nộp bài
      </app-button>
    </div>

    <app-modal
      v-if="modalListQuestions"
      title="Danh sách câu hỏi"
      :footer="false"
      @close="modalListQuestions = false"
    >
      <ElearningExerciseListQuestions
        slot="content"
        :isAnswer="false"
        :type="EXERCISE_TYPES.CHOICE"
      />
    </app-modal>

    <app-modal-confirm
      v-if="modalConfirmSubmit"
      title="Xác nhận nộp bài"
      description="Bạn có chắc chắn muốn nộp bài?"
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
import {
  EXERCISE_TYPES,
  STUDY_MODE,
  EXERCISE_CATEGORIES,
  PAGE_SIZE,
  DO_EXERCISE_STATUS,
  QUESTION_NAV
} from "~/utils/constants";
import IconArrowBack from "~/assets/svg/v2-icons/arrow_back_24px.svg?inline";
import IconArrowForward from "~/assets/svg/v2-icons/arrow_forward_24px.svg?inline";
import IconSend from "~/assets/svg/v2-icons/send_24px.svg?inline";
import IconCloudDownload24px from "~/assets/svg/v2-icons/cloud_download_24px.svg?inline";
import ElearningExerciseListQuestions from "~/components/page/elearning/study/exercise/ElearningExerciseListQuestions";
import IconFormatListNumbered24px from "~/assets/svg/v2-icons/format_list_numbered_24px.svg?inline";


import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { createExerciseSubmissionReq } from "~/models/elearning/ExerciseSubmissionReq";
import { fullUTCDateTimeSlash } from "~/utils/moment";
import { RESPONSE_SUCCESS } from "~/utils/config";
import { get } from "lodash";

export default {
  components: {
    IconArrowBack,
    IconArrowForward,
    IconSend,
    IconCloudDownload24px,
    ElearningExerciseListQuestions,
    IconFormatListNumbered24px
  },

  props: {
    questionId: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      EXERCISE_TYPES: Object.freeze(EXERCISE_TYPES),
      questionNo: this.questionId,
      answer: null,
      modalListQuestions: false,
      modalConfirmSubmit: false,
      notify: {
        type: "",
        description: "",
        isShowNotify: false
      }
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", [
      "currentExerciseQuestion",
      "submission",
      "currentExerciseAnswers",
      "currentElearningId",
      "currentQuestionId",
      "autoSubmission",
      "currentExercise",
      "currentLession"
    ]),

    ...mapState("elearning/study/study-progress", ["progress"]),

    ...mapGetters("elearning/study/study-exercise", [
      "questionNoOpts",
      "currentQuestionIndex",
      "numOfQuestion"
    ]),

    isDisableBack() {
      return this.currentQuestionIndex < 1;
    },

    isDisableNext() {
      return this.currentQuestionIndex >= this.numOfQuestion - 1;
    }
  },

  methods: {
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseQuestionNav",
      "setStudyExerciseSubmission",
      "setStudyExerciseCurrentByNo"
    ]),
    ...mapMutations("event", ["setStudyMode", "setDoExerciseStatus"]),

    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyExerciseSubmissionAdd",
      "elearningSudyExerciseSubmissionList",
      "elearningSudyElearningExerciseList"
    ]),

    ...mapActions("elearning/study/study-progress", [
      "elearningSudyProgressList"
    ]),

    handleQuestionBack() {
      this.setStudyExerciseQuestionNav(QUESTION_NAV.BACK);
      console.log(
        "[handleQuestionBack]",
        this.currentExerciseQuestion,
        this.currentExerciseAnswers
      );
      this.setAnswered();
    },

    handleQuestionContinue() {
      this.setStudyExerciseQuestionNav(QUESTION_NAV.NEXT);
      console.log(
        "[handleQuestionContinue]",
        this.currentExerciseQuestion,
        this.currentExerciseAnswers
      );
      this.setAnswered();
    },

    handleQuestionSubmission() {
      console.log("[handleQuestionSubmission]", this.currentExerciseQuestion, new Date());

      const submissionReq = createExerciseSubmissionReq({
        exercise_id: this.submission.exercise_id,
        answers: this.submission.answers,
        attachments: null,
      });

      // const submissionForm = new FormData();
      // submissionForm.append("exercise_id", this.submission.exercise_id);
      // submissionForm.append("answers", JSON.stringify(this.submission.answers));
      // submissionForm.append("attachments", null);

      console.log("[handleQuestionSubmission] submissionReq", {
        exercise_id: this.submission.exercise_id,
        answers: this.submission.answers,
      });

      this.elearningSudyExerciseSubmissionAdd(submissionReq).then(res => {
        // renew list progress
        if (res.success == RESPONSE_SUCCESS) {
          this.modalConfirmSubmit = false;
          // this.notify = {
          //   type: "success",
          //   title: "Chúc mừng bạn đã hoàn thành bài tập",
          //   isShowNotify: true
          // };
          this.setDoExerciseStatus(DO_EXERCISE_STATUS.SUBMISSION_DONE);
          this.reNewGetElearningProgress();

          // emit studyMode=DO_EXERCISE
          this.setStudyMode(STUDY_MODE.DO_EXERCISE);
          // get list EXERCISE
          let exerciseReq = null;
          if (this.currentLession) {
            exerciseReq = {
              elearning_id: this.progress.id,
              category: EXERCISE_CATEGORIES.EXERCISE,
              lesson_id: this.currentLession.id,
              size: PAGE_SIZE.MAXIMIZE,
            };
          } else {
            exerciseReq = {
              elearning_id: this.progress.id,
              category: EXERCISE_CATEGORIES.TEST,
              size: PAGE_SIZE.MAXIMIZE,
            };
          }
          console.log("[exerciseReq]", exerciseReq);
          this.elearningSudyElearningExerciseList(exerciseReq);
        } else {
          this.modalConfirmSubmit = false;
          this.notify = {
            type: "error",
            title: res.message,
            isShowNotify: true
          };
        }
      });
    },

    handleShowListQuestion() {
      console.log("[handleShowListQuestion]");
      this.modalListQuestions = true;
    },

    handleChangedQuestionNumber(_questionIdByNav) {
      console.log("[handleChangedQuestionNumber]", _questionIdByNav);
      if (_questionIdByNav) {
        // nav to question from modal list question
        this.questionNo = _questionIdByNav;
      }
      this.setStudyExerciseCurrentByNo(this.questionNo);
      this.setAnswered();
    },

    setAnswered() {
      // set current answered you checked
      const answered = this.currentExerciseAnswers.find(
        an => an.question_id == this.currentExerciseQuestion.id
      );
      if (answered && answered.choise_answer_id) {
        this.answer = answered.choise_answer_id;
      } else {
        this.answer = null;
      }
    },

    reNewGetElearningProgress() {
      console.log("[reNewGetElearningProgress]", this.progress);
      const elearning_id = this.progress.id;
      this.elearningSudyProgressList({
        params: {
          elearning_id
        }
      });
    }
  },

  watch: {
    answer(_newVal, _oldVal) {
      const answers = {
        question_id: this.currentExerciseQuestion.id,
        choise_answer_id: this.answer,
        answer: null, // only in case essay
        attach_answer_index: null // only in case essay
      };
      console.log("[answer] watch", _newVal, _oldVal, answers);
      if (_newVal != _oldVal) {
        this.setStudyExerciseSubmission({ answers });
      }
    },

    currentExerciseQuestion(_newVal) {
      console.log("[currentExerciseQuestion]", _newVal);
      // set current question Option
      this.questionNo = _newVal.id;
    },

    currentQuestionId(_newVal) {
      console.log("[currentQuestionId] watch", _newVal);
      if (_newVal) {
        this.handleChangedQuestionNumber(_newVal);
        this.modalListQuestions = false;
      }
    },

    autoSubmission(_newVal) {
      console.log("[autoSubmission]", _newVal, this.currentExercise);
      if (this.currentExercise.id == _newVal.id) {
        console.log("[handleQuestionSubmission] start");
        this.handleQuestionSubmission();
      }
    }
  }
};
</script>

<style></style>
