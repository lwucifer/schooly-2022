<template>
  <div class="cc-box__bg-disable">
    <!-- <label class="d-inline-block mb-3 font-weight-bold" for="question-editor"
      >Nội dung câu hỏi</label
    > -->
    <div class="d-flex justify-content-between align-items-center">
      <label class="mb-3 font-weight-semi-bold" for="question-editor"
        >Nội dung câu hỏi</label
      >
      <QuestionSelectFile @onChange="handleChangeFile" :question="question" />
    </div>

    <app-editor class="mb-4" id="question-editor" v-model="payload.content" />

    <div class="row">
      <div class="col-md-3">
        <label class="d-inline-block mb-3 font-weight-bold" for="answer"
          >Chọn đáp án đúng</label
        >
      </div>

      <div class="col-md-8">
        <label
          class="d-inline-block mb-3"
          style="margin-left: 1.5rem"
          for="answer-editor"
          >Nội dung đáp án</label
        >
      </div>
    </div>

    <CreateAnswerOfQuestion
      v-for="(answer, index) in get(payload, 'answers', [])"
      :key="answer.id"
      :answer="answer"
      :index="index"
      :id="get(payload, 'id', '')"
      @handleSelectAnswerTrue="handleSelectAnswerTrue"
      @handleChangeContent="handleChangeContentAnswer"
      @handleAddAnswer="handleAddAnswer"
      @handleDeleteAnswer="handleDeleteAnswer"
    />

    <div class="d-flex justify-content-end mt-5 mb-4">
      <app-button
        color="default"
        class="font-weight-semi-bold mr-4 text-secondary"
        outline
        size="md"
        @click="$emit('cancel')"
        >Huỷ</app-button
      >
      <app-button
        color="primary"
        class="font-weight-semi-bold"
        size="md"
        @click="handleSubmitQuestion"
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
import { get, cloneDeep } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { createPayloadQuestion } from "~/models/course/AddCourse";
import { mapState } from "vuex";

export default {
  components: {
    IconTrashAlt,
    CreateAnswerOfQuestion,
    IconCloudDownload24px,
    IconCloseSquare,
    QuestionSelectFile,
  },
  computed: {
    ...mapState("elearning/create", {
      general: "general",
      lesson: "lesson",
    }),
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
        content: get(this, "question.content", ""),
        answers: cloneDeep(get(this, "question.answers", [])),
        file: null,
        is_delete_file: null,
      },
    };
  },

  methods: {
    handleChangeFile(file) {
      this.payload.is_delete_file = null;
      if (!file) this.payload.is_delete_file = true;
      this.payload.file = file;
    },

    handleSubmitQuestion() {
      this.showModalConfirm = true;
    },

    async handleOk() {
      this.confirmLoading = true;
      this.handleCheckAnswers();

      let formData = new FormData();
      if (this.payload.id) {
        formData.append("id", this.payload.id);
      }

      if (this.payload.content) {
        formData.append("content", this.payload.content);
      }

      if (this.payload.file) {
        formData.append("file", this.payload.file);
      }

      if (this.payload.is_delete_file) {
        formData.append("is_delete_file", this.payload.is_delete_file);
      }

      if (get(this, "payload.answers.length", 0)) {
        formData.append("answers", JSON.stringify(this.payload.answers));
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
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },

    handleSelectAnswerTrue(index) {
      this.payload.answers.map((answer, key) => {
        this.payload.answers[key].correct = key === index;
      });
    },

    handleChangeContentAnswer(index, value) {
      this.payload.answers[index].content = value;
    },
    handleAddAnswer(index) {
      const answer = {
        correct: false,
        content: "",
      };
      if (index == get(this, "payload.answers.length", 0) && index < 6) {
        let answers = this.payload.answers.concat([answer]);
        this.payload.answers = answers;
      }
    },
    handleDeleteAnswer(index) {
      if (this.payload.answers.length > 2) {
        this.payload.answers.splice(index, 1);
      } else {
        this.$toasted.error("Tối thiểu là 2 đáp án");
      }
    },
    handleCheckAnswers() {
      var lastanswer = this.payload.answers.slice(-1)[0];
      const answer = {
        correct: false,
        content: "",
      };
      const check = _.isEqual(lastanswer, answer);
      if (this.payload.answers.length > 2 && check) {
        this.payload.answers.pop();
      }
    },
    get,
  },
};
</script>
