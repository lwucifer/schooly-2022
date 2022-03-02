<template>
  <div class="e-exercise-essay">
    <div class="mb-3">
      <div class="d-flex justify-content-between mb-2">
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
        <div class="d-flex justify-content-end align-items-center">
          <a
            v-if="currentExerciseQuestion.file_url"
            :href="currentExerciseQuestion.file_url"
            download
            class="d-flex text-decoration-none mr-3"
            target="_blank"
          >
            <IconCloudDownload24px class="icon fill-opacity-1 body-1 mr-2" />Tải
            câu hỏi</a
          >
          <IconFormatListNumbered24px
            class="ext-decoration-none text-clickable"
            @click.prevent="handleShowListQuestion"
          />
        </div>
      </div>

      <div
        class="e-exercise-essay__question-name bg-gray"
        v-html="currentExerciseQuestion.content"
      ></div>
    </div>

    <div class="mb-10">
      <label class="d-inline-block mb-2" for="essay-answer">Câu trả lời</label>
      <app-upload
        class="mr-auto text-primary"
        style="display: inline-block; float: right;"
        accept=".doc, .docx, .pdf, .rtf , .txt, .csv, .xls, .xlsx, .ppt, .pptx, .zip"
        @change="handleUploadAnswer"
      >
        <IconCloudUpload class="icon fill-opacity-1 body-1 mr-2" />Tải lên câu
        trả lời
      </app-upload>

      <app-editor class="mb-4" id="essay-answer" v-model="answer" />
    </div>
    <div
      class="d-flex mt-15 justify-content-start"
      v-if="currentUploadAnswered"
    >
      <div class="e-exercise-essay__attachment">
        <span class="mr-2 font-weight-medium">{{
          currentUploadAnswered.name
        }}</span>
        <span class="mr-2 e-exercise-essay__attachment__weight"
          >{{ currentUploadAnswered.size }} KB</span
        >
      </div>
      <IconClose
        class="fill-white e-exercise-essay__icon text-clickable"
        @click.prevent="removeUploadFile"
      />
    </div>

    <div class="e-exercise-essay__bottom d-flex mt-15">
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
        @click.prevent="modalConfirmSubmit = true; confirmLoading = false;"
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
        :type="EXERCISE_TYPES.ESSAY"
      />
    </app-modal>

    <app-modal-confirm
      v-if="modalConfirmSubmit"
      title="Xác nhận nộp bài"
      description="Bạn có chắc chắn muốn nộp bài?"
      :confirmLoading="confirmLoading"
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
import IconCloudUpload from "~/assets/svg/v2-icons/cloud_upload_24px.svg?inline";
import IconSend from "~/assets/svg/v2-icons/send_24px.svg?inline";
import IconArrowBack from "~/assets/svg/v2-icons/arrow_back_24px.svg?inline";
import IconArrowForward from "~/assets/svg/v2-icons/arrow_forward_24px.svg?inline";
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconFormatListNumbered24px from "~/assets/svg/v2-icons/format_list_numbered_24px.svg?inline";
import IconCloudDownload24px from "~/assets/svg/v2-icons/cloud_download_24px.svg?inline";

import ElearningExerciseListQuestions from "~/components/page/elearning/study/exercise/ElearningExerciseListQuestions";

import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { createExerciseSubmissionReq } from "~/models/elearning/ExerciseSubmissionReq";
import { fullDateTimeSlash } from "~/utils/moment";
import { RESPONSE_SUCCESS } from "~/utils/config";
import {
  QUESTION_NAV,
  STUDY_MODE,
  EXERCISE_CATEGORIES,
  PAGE_SIZE,
  DO_EXERCISE_STATUS,
  EXERCISE_TYPES
} from "~/utils/constants";

export default {
  components: {
    IconSend,
    IconCloudUpload,
    IconArrowForward,
    IconArrowBack,
    IconClose,
    ElearningExerciseListQuestions,
    IconFormatListNumbered24px,
    IconCloudDownload24px
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
      modalConfirmSubmit: false,
      answer: null,
      questionNo: this.questionId,
      modalListQuestions: false,
      confirmLoading: false,
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

    ...mapState("event", ["studyMode"]),

    ...mapGetters("elearning/study/study-exercise", [
      "questionNoOpts",
      "currentQuestionIndex",
      "numOfQuestion"
    ]),

    currentUploadAnswered() {
      if (
        !this.submission ||
        !this.submission.attachments ||
        !this.submission.attachments.length
      )
        return "";
      const currentAttachment = this.submission.attachments.find(
        a => a.question_id == this.currentExerciseQuestion.id
      );
      const currFile = currentAttachment ? currentAttachment.file : null;
      if (currFile) {
        return {
          name: currFile.name,
          size: parseFloat(currFile.size / 1000).toFixed(1),
          question_id: currentAttachment.question_id
        };
      }
    },

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

    handleQuestionSubmission() {
      console.log("[handleQuestionSubmission] bf", this.submission, new Date());

      const attachments = this.submission.attachments.filter(f => f.file).map(m => m.file);
      

      const submissionForm = new FormData();
      submissionForm.append("exercise_id", this.submission.exercise_id);
      submissionForm.append("answers", JSON.stringify(this.submission.answers));
      attachments.map(singleFile => {
        submissionForm.append("attachments", singleFile);
      })

      console.log("[handleQuestionSubmission] submissionReq", {
        exercise_id: this.submission.exercise_id,
        answers: this.submission.answers,
        attachments: attachments
      });

      this.confirmLoading = true;

      this.elearningSudyExerciseSubmissionAdd(submissionForm).then(res => {
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
            // list exercise
            exerciseReq = {
              elearning_id: this.progress.id,
              category: EXERCISE_CATEGORIES.EXERCISE,
              lesson_id: this.currentLession.id,
              size: PAGE_SIZE.MAXIMIZE,
            };
          } else {
            // list test
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

        this.confirmLoading = false;
      });
    },

    removeUploadFile() {
      console.log("[removeUploadFile]", this.currentExerciseQuestion);
      this.setStudyExerciseSubmission({
        file: null,
        question_id: this.currentExerciseQuestion.id
      });
    },

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

    handleUploadAnswer(file) {
      console.log("[handleUploadAnswer]", file);
      // this.$toasted.success("Tải câu trả lời lên thành công");
      const fileUploaded = file ? file[0] : null;
      this.setStudyExerciseSubmission({
        file: fileUploaded,
        question_id: this.currentExerciseQuestion.id
      });
    },

    handleShowListQuestion() {
      console.log("[handleShowListQuestion]", this.submission);
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
      console.log(
        "[setAnswered]",
        this.currentExerciseAnswers,
        this.currentExerciseQuestion
      );
      const answered = this.currentExerciseAnswers.find(
        an => an.question_id == this.currentExerciseQuestion.id
      );
      if (answered && answered.answer) {
        this.answer = answered.answer;
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
        choise_answer_id: null, // only incase choice
        answer: this.answer
        // attach_answer_index: null,
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
