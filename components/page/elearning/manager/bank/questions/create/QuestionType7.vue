<template>
  <div class="create-question">
    <div class="d-flex">
      <div class="mr-6 pr-6">
        <p class="label">Loại câu hỏi:</p>
        <div class="d-flex-center">
          <IconQuestion7 />
          <strong class="color-primary ml-3">Tự luận</strong>
        </div>
      </div>
      <!-- <div>
        <p class="label">Chọn cấp độ cho câu hỏi:</p>
        <div class="radios">
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[0]['id']"
            :checked="data.manual.level === levels[0]['id']"
            >Dễ</app-radio
          >
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[1]['id']"
            :checked="data.manual.level === levels[1]['id']"
            >Trung bình</app-radio
          >
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[2]['id']"
            :checked="data.manual.level === levels[2]['id']"
            >Khó</app-radio
          >
        </div>
      </div> -->
    </div>
    <div class="mt-5 mb-4">
      <p class="label">Nội dung câu hỏi:</p>
      <app-editor
        class="bg-input-gray mb-3"
        :sticky-offset="`{ top: 40, bottom: 0 }`"
        v-model="data.manual.content"
      />
    </div>

    <div class="mb-4">
      <p class="label">Hình thức nộp bài:</p>
      <!-- <div>
        <app-checkbox
          @change="handleChangeSubmissionManual"
          class="mr-6"
          :checked="submission_form_manual"
          >Nhập văn bản</app-checkbox
        >
        <app-checkbox
          @change="handleChangeSubmissionUpload"
          :checked="submission_form_upload"
          >Tải file</app-checkbox
        >
      </div> -->
      <div>
        <app-radio
          @input="switchMethod('MANUAL')"
          class="mr-6"
          :checked="submission_form_manual"
          name="sub-method"
          >Nhập văn bản</app-radio
        >
        <app-radio
          @input="switchMethod('UPLOAD')"
          :checked="submission_form_upload"
          name="sub-method"
          >Tải file</app-radio
        >
      </div>
    </div>

    <div class="mt-4">
      <div class="label d-flex-center" @click="showMemo = !showMemo">
        <IconRight v-if="!showMemo" />
        <IconDown v-else />
        <span class="pr-3">Ghi chú</span>
        <div class="tooltip">
          <IconHelp />
          <p class="text">Giải thích đáp án đúng hoặc kiến thức bổ sung</p>
        </div>
      </div>
      <app-input
        textarea
        v-if="showMemo"
        rows="3"
        placeholder="Viết ghi chú..."
        v-model="data.manual.note"
      />
    </div>
  </div>
</template>

<script>
import IconHelp from "~/assets/svg/v2-icons/help_24px.svg?inline";
import IconRight from "~/assets/svg/v2-icons/chevron_right_24px.svg?inline";
import IconDown from "~/assets/svg/v2-icons/chevron_down_24px.svg?inline";
import IconEdit24 from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconDelete from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconQuestion7 from "~/assets/svg/images/question7.svg?inline";
import { get, cloneDeep } from "lodash";
import { useEffect } from "~/utils/common";
import { LEVEL_QUESTIONS } from "~/utils/constants";

export default {
  components: {
    IconQuestion7,
    IconHelp,
    IconRight,
    IconDown,
    IconEdit24,
    IconDelete,
  },

  props: {
    visible: Boolean,
    question: {},
  },

  data() {
    return {
      showEditAnswer: false,
      showMemo: false,
      active: 1,
      name: "",
      levels: LEVEL_QUESTIONS,
      submission_form_manual: false,
      submission_form_upload: false,
      level: "1",
      error: {},
      data: {
        manual: {
          // level: "",
          content: "",
          note: "",
        },
        submission_form: "",
      },
    };
  },

  mounted() {
    useEffect(this, this.handleChangeQuestion.bind(this), ["question"]);
    useEffect(this, this.handleChangeData.bind(this), ["data"]);
    useEffect(this, this.handleChangeSubmission.bind(this), [
      "submission_form_manual",
      "submission_form_upload",
    ]);
  },

  methods: {
    handleChangeQuestion() {
      if (this.question) {
        this.data = cloneDeep(this.question);
        this.submission_form_manual =
          this.question.submission_form === "MANUAL" ||
          this.question.submission_form === "BOTH";
        this.submission_form_upload =
          this.question.submission_form === "UPLOAD" ||
          this.question.submission_form === "BOTH";
      }
    },

    handleChangeData() {
      this.$emit("handleChangeData", this.data);
    },

    handleChangeSubmissionManual(checked) {
      this.submission_form_manual = checked;
    },

    handleChangeSubmissionUpload(checked) {
      this.submission_form_upload = checked;
    },

    handleChangeSubmission() {
      if (this.submission_form_manual) {
        this.data.submission_form = "MANUAL";
      }
      if (this.submission_form_upload) {
        this.data.submission_form = "UPLOAD";
      }
      if (this.submission_form_manual && this.submission_form_upload) {
        this.data.submission_form = "BOTH";
      }
    },

    // handleChangeLevel(e) {
    //   this.data.manual.level = e.target.value;
    // },
    switchMethod(type) {
      if (type == 'MANUAL') {
        this.submission_form_manual = true;
        this.submission_form_upload = false;
      }
      if (type == 'UPLOAD') {
        this.submission_form_upload = true;
        this.submission_form_manual = false;
      }
    },
    get,
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>
