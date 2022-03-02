<template>
  <div>
    <div v-if="showAddPoint">
      <!-- <label class="d-inline-block mb-3" for="question-editor">Điểm</label>
      <app-input v-model="payload.points" /> -->

      <div>
        <label
          class="d-inline-block mb-3 font-weight-semi-bold"
          for="question-editor"
          >Điểm câu này</label
        >
        <div class="d-flex align-items-center justify-content-start mb-4">
          <app-input
            class="mb-0 mr-4 w-150 ce-input-with-unit"
            v-model="payload.points"
          >
            <template #unit><span class="text-dark">/10</span> </template>
          </app-input>

          <p class="text-primary">
            * Một bài tập hợp lệ phải có
            <strong>tổng điểm các câu hỏi là 10</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- <label class="d-inline-block mb-3" for="question-editor"
      >Nội dung câu hỏi</label
    > -->
    <div class="d-flex justify-content-between align-items-center">
      <label class="mb-3 font-weight-semi-bold" for="question-editor"
        >Nội dung câu hỏi</label
      >
      <QuestionSelectFile @onChange="handleChangeFile" :question="question" />
    </div>
    <app-editor v-model="payload.content" />

    <!-- <label class="d-inline-block mb-3" for="question-editor"
      >Nội dung câu trả lời</label
    >
    <app-editor v-model="payload.answers[0].content" /> -->

    <div class="d-flex justify-content-end mt-5 mb-4">
      <app-button
        class="font-weight-semi-bold mr-4 text-secondary"
        size="md"
        color="default"
        outline
        @click="$emit('cancel')"
        >Huỷ</app-button
      >
      <app-button
        color="primary"
        class="font-weight-semi-bold"
        size="md"
        @click="handleAddQuestion"
        >Lưu câu hỏi</app-button
      >
    </div>

    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      description="Bạn có chắc chắn muốn lưu thay đổi này?"
    />
  </div>
</template>

<script>
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconCloudDownload24px from "~/assets/svg/v2-icons/cloud_download_24px.svg?inline";
import IconCloseSquare from "~/assets/svg/icons/close-square.svg?inline";
import QuestionSelectFile from "~/components/page/course/create/common/QuestionSelectFile";
import CreateAnswerOfQuestion from "~/components/page/course/create/exercise/CreateAnswerOfQuestion";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { createPayloadQuestion } from "~/models/course/AddCourseNoAnswer";
import { mapState } from "vuex";

export default {
  components: {
    IconCloudDownload24px,
    IconCloseSquare,
    QuestionSelectFile,
  },

  props: {
    question: {
      type: Object,
      default: null,
    },
    exercise: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      showModalConfirm: false,
      confirmLoading: false,
      payload: {
        id: get(this, "question.id", ""),
        type: "ESSAY",
        content: get(this, "question.content", ""),
        points: get(this, "question.points", ""),
        file: null,
        is_delete_file: null,
      },
    };
  },
  computed: {
    ...mapState("elearning/create", {
      general: "general",
      lesson: "lesson",
    }),
    showAddPoint() {
      return (
        get(this, "exercise.category", "") === "TEST" ||
        get(this, "exercise.required", "") === true
      );
    },
  },

  methods: {
    handleChangeFile(file) {
      this.payload.is_delete_file = null;
      if (!file) this.payload.is_delete_file = true;
      this.payload.file = file;
    },

    handleAddQuestion() {
      this.showModalConfirm = true;
    },

    async handleOk() {
      this.confirmLoading = true;

      let formData = new FormData();
      if (this.payload.id) {
        formData.append("id", this.payload.id);
      }

      if (this.payload.content) {
        formData.append("content", this.payload.content);
      }

      if (this.payload.points) {
        formData.append("points", this.payload.points);
      }

      if (this.payload.file) {
        formData.append("file", this.payload.file);
      }

      if (this.payload.is_delete_file) {
        formData.append("is_delete_file", this.payload.is_delete_file);
      }

      const res = await this.$axios({
        url: `/elearning/creating/questions`,
        method: "POST",
        data: formData,
      });

      this.handleCancel();

      if (get(res, "data.success", false)) {
        this.$toasted.success("success");
        this.$emit("cancel");
        const lesson_id = get(this, "lesson.id", "");
        this.$store.dispatch("elearning/create/getLesson", lesson_id);
        return;
      }
      this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
    },

    handleCancel() {
      (this.showModalConfirm = false), (this.confirmLoading = false);
    },
    get,
  },
};
</script>
