<template>
  <div class="cc-panel__body-modifer">
    <div v-if="isShowEdit" class="cc-box">
      <UpdateExam @cancel="isShowEdit = !isShowEdit" :exam="exam" />
    </div>
    <div class="cc-box" v-else>
      <div
        :class="{
          'add-border-bottom': get(exam, 'questions', []).length > 0,
        }"
      >
        <div class="cc-box__head">
          <div class="cc-box__head-left">
            <div class="ce-item__left d-flex align-items-center">
              <h2 class="cc-box__title heading-6">
                Bài {{ index + 1 }}:
                {{ examName }}
              </h2>
              <button class="cc-box__btn cc-box__btn-edit-hover mr-3" @click="handleEditExam">
                <IconEditAlt class="icon d-block subheading fill-primary" />
              </button>
              <button class="cc-box__btn cc-box__btn-edit-hover" @click="handleDeleteExam">
                <IconTrashAlt class="d-block subheading fill-secondary" width="20px" height="20px" />
              </button>
            </div>
          </div>

          <div class="cc-box__head-right">
            <p
              class="mr-5"
              v-if="get(exam, 'coefficient', '')"
            >Hệ số: {{ get(exam, "coefficient", "") }}</p>
            <p class="mr-5" v-else>Trọng số: {{ get(exam, "weight", "") }}%</p>
            <button @click.prevent="toggleFormAdd" class="text-primary d-flex align-items-center">
              <IconPlus2 class="mr-3 fill-primary" />
              <span class="font-weight-semi-bold">Thêm câu hỏi</span>
            </button>

            <button
              class="cc-box__btn cc-box__btn-collapse"
              @click="isShowExercise = !isShowExercise"
            >
              <IconAngleDown
                width="20px"
                height="20px"
                class="icon fill-primary"
                v-if="!isShowExercise"
              />
              <IconAngleUp width="20px" height="20px" class="icon fill-primary" v-else />
            </button>
          </div>
        </div>

        <ExamInfo :exam="exam" />
      </div>

      <app-error
        class="mb-2 ml-4"
        v-if="get(exam, 'status', '') == 0"
        :error="`Bạn chưa hoàn thiện nội dung bài kiểm tra`"
      />

      <div
        class="cc-box__body"
        :class="{ 'add-background': isAddQuestionForm, 'py-0': toggleFormAdd }"
      >
        <CreateQuestionChoice
          v-if="isAddQuestionForm && get(exam, 'type', '') === 'CHOICE'"
          :exam="exam"
          @cancel="toggleFormAdd"
        />
        <CreateQuestionEssay
          v-if="isAddQuestionForm && get(exam, 'type', '') === 'ESSAY'"
          :exam="exam"
          @cancel="toggleFormAdd"
        />
        <template v-if="isShowExercise">
          <ListQuestion
            v-for="(question, index) in get(exam, 'questions', [])"
            :key="question.id"
            :index="index"
            :question="question"
            :exam="exam"
          />
        </template>
      </div>
    </div>
    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      description="Bạn có chắc chắn muốn xóa bài kiểm tra này?"
    />
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
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import { get } from "lodash";
import CreateQuestionEssay from "~/components/page/course/create/exams/CreateQuestionEssay";
import CreateQuestionChoice from "~/components/page/course/create/exams/CreateQuestionChoice";
import ListQuestion from "~/components/page/course/create/exams/ListQuestion";
import EditExamName from "~/components/page/course/create/exams/EditExamName";
import IconAngleUp from "~/assets/svg/design-icons/angle-up.svg?inline";
import { mapState } from "vuex";
import UpdateExam from "~/components/page/course/create/exams/UpdateExam";
import ExamInfo from "~/components/page/course/create/exams/ExamInfo";

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
    CreateQuestionChoice,
    ListQuestion,
    EditExamName,
    IconAngleUp,
    IconPlus2,
    UpdateExam,
    ExamInfo
  },

  props: {
    exam: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: 0
    }
  },

  computed: {
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
    examName() {
      return get(this, "exam.title", "").length > 40
        ? get(this, "exam.title", "").slice(0, 40) + "..."
        : get(this, "exam.title", "");
    }
  },

  data() {
    return {
      isAddQuestionForm: false,
      isShowExercise: true,
      isShowEdit: false,
      showModalConfirm: false,
      confirmLoading: false
    };
  },

  methods: {
    handleEditExam() {
      if (this.disabled_all) return;
      this.isShowEdit = !this.isShowEdit;
    },

    handleDeleteExam() {
      if (this.disabled_all) return;
      this.showModalConfirm = true;
    },

    async handleOk() {
      this.confirmLoading = true;
      const payload = {
        id: get(this, "exam.id", "")
      };

      const res = await this.$axios({
        url: "/elearning/creating/test",
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        data: payload
      });

      this.handleCancel();
      if (get(res, "data.success", false)) {
        this.$toasted.success(get(res, "data.message", ""));
        this.$store.dispatch("elearning/create/getExams");
        return;
      }
      this.$toasted.error(get(res, "data.message", ""));
    },

    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },

    toggleFormAdd() {
      if (this.disabled_all) return;
      this.isAddQuestionForm = !this.isAddQuestionForm;
    },
    get
  }
};
</script>

<style lang="scss">
.add-background {
  background: #f9f9f9;
  padding: 2rem !important;
}
</style>
