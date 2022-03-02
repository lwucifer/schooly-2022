<template>
  <div class="list-question">
    <div class="d-flex align-items-center mb-3" v-if="!isShowEditQuestion">
      <h3 class="body-2 mr-1 question-title">Câu {{ index + 1 }}:</h3>

      <div class="body-2 mr-4 question-content font-weight-semi-bold" v-html="limit"></div>

      <span class="mr-4 question-type">{{ type }}</span>

      <span
        class="mr-4 question-point"
        v-if="
          get(question, 'type', '') === 'ESSAY' && get(question, 'points', '')
        "
      >{{ get(question, "points", "") }} điểm</span>

      <div
        class="d-flex align-items-center justify-content-end ce-question-item__actions question-actions"
      >
        <button class="mr-3" @click="handleEditQuestion">
          <IconEditAlt class="icon d-block subheading fill-primary" />
        </button>

        <button @click="handleDeleteQuestion">
          <IconTrashAlt class="d-block subheading fill-secondary" width="20px" height="20px" />
        </button>

        <!-- <button>
        <IconAlignCenterAlt class="icon d-block subheading fill-gray" />
        </button>-->
      </div>

      <app-modal-confirm
        centered
        v-if="showModalConfirm"
        :confirmLoading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        title="Xóa câu hỏi"
        description="Bạn có chắc chắn muốn xóa câu hỏi này?"
      />
    </div>

    <div v-else>
      <EditQuestionChoice
        v-if="get(question, 'type', '') === 'CHOICE'"
        @cancel="toggleAddQuestion"
        :question="question"
        :exercise="exercise"
      />
      <EditQuestionEssay
        v-else
        @cancel="toggleAddQuestion"
        :question="question"
        :exercise="exercise"
      />
    </div>
  </div>
</template>

<script>
import IconInfoCircle from "~/assets/svg/design-icons/info-circle.svg?inline";
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconEditAlt from "~/assets/svg/v2-icons/edit.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconAlignCenterAlt from "~/assets/svg/design-icons/align-center-alt.svg?inline";
import IconFileCheck from "~/assets/svg/design-icons/file-check.svg?inline";
import IconClipboardNotes from "~/assets/svg/design-icons/clipboard-notes.svg?inline";
import { get } from "lodash";
import CreateQuestionEssay from "~/components/page/course/create/exercise/CreateQuestionEssay";
import EditQuestionChoice from "~/components/page/course/create/exercise/EditQuestionChoice";
import EditQuestionEssay from "~/components/page/course/create/exercise/EditQuestionEssay";
import * as actionTypes from "~/utils/action-types";
import { mapState } from "vuex";
import { limitCharacter } from "~/utils/common";

export default {
  components: {
    IconInfoCircle,
    IconAngleDown,
    IconEditAlt,
    IconTrashAlt,
    IconAlignCenterAlt,
    IconFileCheck,
    IconClipboardNotes,
    CreateQuestionEssay,
    EditQuestionChoice,
    EditQuestionEssay
  },

  props: {
    question: {
      type: Object,
      default: null
    },
    exercise: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      isShowEditQuestion: false,
      showModalConfirm: false,
      confirmLoading: false
    };
  },

  computed: {
    type() {
      return get(this, "question.type", "") === "CHOICE"
        ? "Câu hỏi trắc nghiệm"
        : "Câu hỏi tự luận";
    },
    ...mapState("elearning/create", {
      general: "general",
      lesson: "lesson"
    }),

    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },

    limit() {
      const value = get(this, "question.content", "");

      return limitCharacter(value, 60, 20);
    }
  },

  methods: {
    handleEditQuestion() {
      if (this.disabled_all) return;
      this.isShowEditQuestion = !this.isShowEditQuestion;
    },
    handleDeleteQuestion() {
      if (this.disabled_all) return;
      this.showModalConfirm = true;
    },

    async handleOk() {
      this.confirmLoading = true;
      const payload = {
        id: get(this, "question.id", "")
      };
      const res = await this.$store.dispatch(
        `elearning/creating/creating-question/${actionTypes.ELEARNING_CREATING_QUESTIONS.DELETE}`,
        payload
      );
      this.handleCancel();
      if (get(res, "success", false)) {
        this.$toasted.success("success");
        const lesson_id = get(this, "lesson.id", "");
        this.$store.dispatch("elearning/create/getLesson", lesson_id);

        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },

    toggleAddQuestion() {
      this.isShowEditQuestion = !this.isShowEditQuestion;
    },

    get
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/course/create/_list-question.scss";
</style>
