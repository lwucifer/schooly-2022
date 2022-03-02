<template>
  <div class="elearning-question-type">
    <div class="eqt__content-question">
      <div>
        <span>{{ currentExerciseQuestion.index }}</span>
      </div>
      <span v-html="currentExerciseQuestion.manual.content"></span>
    </div>
    <div class="eqt__content-answer">
      <app-input
        placeholder="Nhập câu trả lời tự luận"
        class="input-answer"
        textarea
        v-if="submission_form == 'MANUAL' || submission_form == 'BOTH'"
        v-model="answer"
      />
      <div
        class="content-upload"
        v-for="(item, index) in nameFiles"
          :key="index"
      >
        <div
          class="d-flex align-items-center"
        >
          <IconCsv height="24" class="mr-3" />
          <a class="dont-break-out">{{ item }}</a>
        </div>
        <IconCheckPrimary class="ml-auto" />
      </div>
      <app-upload
        @change="handleUploadAnswer"
        v-if="submission_form == 'UPLOAD' || submission_form == 'BOTH'"
        accept=".doc, .docx, .pdf, .rtf , .txt, .csv, .xls, .xlsx, .ppt, .pptx, .jpeg, .jpg, .png, .gif, .bmp, .heic"
        :multiple="true"
      >
        <app-button color="white" :loading="loadingUpload">
          <IconCloudUpload24px height="16" class="mr-3" />
          Tải câu trả lời
        </app-button>
      </app-upload>
    </div>
  </div>
</template>

<script>
import IconCloudUpload24px from "~/assets/svg/v2-icons/cloud_upload_24px.svg?inline";
import IconCsv from "~/assets/svg/v2-icons/csv.svg?inline";
import IconCheckPrimary from "~/assets/svg/v2-icons/check_primary.svg?inline";

import { mapState, mapMutations, mapActions } from "vuex";
import { get } from "lodash";
import { RESPONSE_SUCCESS } from "~/utils/config";
import { STUDY_MODE } from "~/utils/constants";

export default {
  components: {
    IconCloudUpload24px,
    IconCsv,
    IconCheckPrimary
  },

  props: {
    questionChange: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      nameFiles: [],
      answer: null,
      loadingUpload: false
    };
  },
  computed: {
    ...mapState("elearning/study/study-exercise", [
      "currentExerciseQuestion",
      "currentExerciseAnswers"
    ]),
    submission_form() {
      return get(this, "currentExerciseQuestion.submission_form", "BOTH"); // hình thức nộp bài "tự nhập | upload" (MANUAL | UPLOAD | BOTH)
    }
  },

  methods: {
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseSubmission"
    ]),
    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyExerciseUploadFile"
    ]),

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
      if (answered && answered.submissions && answered.submissions.length > 0) {
        this.answer = answered.submissions[0].answer;
        this.nameFiles = answered.submissions[0].nameFiles;
      } else {
        this.answer = null;
        this.nameFiles = [];
      }
      console.log("[setAnswered] answer", this.answer);
    },

    handleUploadAnswer(val) {
      console.log("[handleUploadAnswer]", val);
      this.loadingUpload = true;
      const payload = {
        question_id: this.currentExerciseQuestion.id,
        answer: val
      };
      const formData = new FormData();
      formData.append("question_id", this.currentExerciseQuestion.id);
      for (var i = 0; i < val.length; i++) {
        formData.append("answer", val[i]);
      }

      console.log("[handleUploadAnswer]", payload);
      this.elearningSudyExerciseUploadFile(formData)
        .then(result => {
          if (result.success == RESPONSE_SUCCESS) {
            this.uploadFile = true;
            
            let tmp = [];
            for (var i = 0; i < val.length; i++) {
              tmp.push(val[i].name);
            }
            this.nameFiles = [...tmp].filter(n => !!n);
            console.log("[nameFiles]", this.nameFiles);
          } else {
            this.$toasted.error("Tải tệp trả lời thất bại");
          }

          this.loadingUpload = false;
        })
        .catch(error => {
          this.$toasted.error("Tải tệp trả lời thất bại");
          this.loadingUpload = false;
        });
    }
  },

  watch: {
    answer(_newVal, _oldVal) {
      const answers = [
        {
          question_id: this.currentExerciseQuestion.id,
          answer: this.answer,
          nameFiles: this.nameFiles
        }
      ];
      console.log("[answer] watch", _newVal, _oldVal, answers);
      if (_newVal != _oldVal) {
        this.setStudyExerciseSubmission({ answers });
      }
    },

    nameFiles(_newVal, _oldVal) {
      const answers = [
        {
          question_id: this.currentExerciseQuestion.id,
          answer: this.answer,
          nameFiles: this.nameFiles
        }
      ];
      console.log("[nameFiles] watch", _newVal, _oldVal, answers);
      if (_newVal != _oldVal) {
        this.setStudyExerciseSubmission({ answers });
      }
    },

    questionChange: {
      immediate: true,
      handler(_newVal, _oldVal) {
        console.log("[questionChange] watch Essay", _newVal);
        this.setAnswered();
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-question.scss";
</style>
