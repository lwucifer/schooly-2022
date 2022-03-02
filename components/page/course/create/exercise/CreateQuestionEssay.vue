<template>
  <div class="mb-4">
    <div v-if="showAddPoint">
      <!-- <label class="d-inline-block mb-3 font-weight-bold" for="question-editor"
        >Điểm</label
      >
      <app-input v-model="payload.points" /> -->
      <div>
        <label
          class="d-inline-block mb-3 font-weight-semi-bold"
          for="question-editor"
          >Điểm câu này</label
        >
        <div class="d-flex align-items-center justify-content-start mb-4">
          <app-input
            class="mb-0 w-150 ce-input-with-unit"
            v-model="payload.points"
          >
            <template #unit><span class="text-dark">/10</span> </template>
          </app-input>

          <p class="text-primary ml-4">
            * Một bài tập tự luận hợp lệ phải có
            <strong>tổng điểm các câu hỏi là 10</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- <label class="d-inline-block mb-3 font-weight-semi-bold" for="question-editor"
      >Nội dung câu hỏi</label
    > -->
    <div class="d-flex justify-content-between align-items-center">
      <label class="mb-3 font-weight-semi-bold" for="question-editor"
        >Nội dung câu hỏi</label
      >
      <QuestionSelectFile @onChange="handleChangeFile" />
    </div>
    <app-editor v-model="payload.content" class="mb-4" />

    <div class="d-flex justify-content-end mt-5">
      <app-button
        color="default"
        outline
        class="font-weight-semi-bold mr-4 text-secondary"
        size="md"
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
      title="Tạo câu hỏi"
      description="Bạn có chắc chắn muốn tạo câu hỏi này?"
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
  props: {
    exercise: {
      type: Object,
      default: null,
    },
  },

  components: {
    IconCloudDownload24px,
    IconCloseSquare,
    QuestionSelectFile,
  },

  data() {
    return {
      showModalConfirm: false,
      confirmLoading: false,
      payload: {
        exercise_id: get(this, "exercise.id", ""),
        type: "ESSAY",
        content: "",
        points: "",
        file: null,
      },
    };
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
    }),
    ...mapState("elearning/create", {
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
      this.payload.file = file;
    },

    handleAddQuestion() {
      this.showModalConfirm = true;
    },

    async handleOk() {
      this.confirmLoading = true;

      let formData = new FormData();
      if (this.payload.exercise_id) {
        formData.append("exercise_id", this.payload.exercise_id);
      }

      if (this.payload.points) {
        formData.append("points", this.payload.points);
      }

      if (this.payload.type) {
        formData.append("type", this.payload.type);
      }

      if (this.payload.content) {
        formData.append("content", this.payload.content);
      }

      if (this.payload.file) {
        formData.append("file", this.payload.file);
      }

      // if (get(this, "payload.answers.length", 0)) {
      //   formData.append("answers", JSON.stringify(this.payload.answers));
      // }

      const res = await this.$axios({
        url: `/elearning/creating/questions`,
        method: "POST",
        data: formData,
      });

      // const payload = createPayloadQuestion(this.payload);
      // const res = await this.$store.dispatch(
      //   `elearning/creating/creating-question/${actionTypes.ELEARNING_CREATING_QUESTIONS.ADD}`,
      //   payload
      // );

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

<style lang="scss" scoped>
@import "~assets/scss/components/course/create/_create-question-essay.scss";
</style>
