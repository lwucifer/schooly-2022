<template>
  <div class="cc-panel__body-modifer">
    <div class="cc-box" v-if="isShowEditExercise">
      <UpdateExercise
        @cancel="isShowEditExercise = !isShowEditExercise"
        :exercise="exercise"
        :lesson="lesson"
      />
    </div>
    <div class="cc-box" v-else>
      <div
        :class="{
          'add-border-bottom': get(exercise, 'questions', []).length > 0,
        }"
      >
        <div class="cc-box__head">
          <div class="cc-box__head-left">
            <div class="ce-item__left d-flex align-items-center">
              <div class="mr-3">
                <h2 class="cc-box__title heading-6">
                  Bài {{ index + 1 }}:
                  {{
                  get(exercise, "title", "").length > 40
                  ? get(exercise, "title", "").slice(0, 40) + "..."
                  : get(exercise, "title", "")
                  }}
                </h2>
              </div>
              <button class="cc-box__btn mr-3 cc-box__btn-edit-hover" @click="handleEditExercise">
                <IconEditAlt class="icon d-block subheading fill-primary" />
              </button>
              <button class="cc-box__btn cc-box__btn-edit-hover" @click="handleDeleteExercise">
                <IconTrashAlt class="d-block subheading fill-secondary" width="20px" height="20px" />
              </button>
            </div>
          </div>

          <div class="cc-box__head-right">
            <!-- <p class="mr-5">Trọng số: 30%</p> -->
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

        <ExerciseInfo :exercise="exercise" />
      </div>

      <app-error
        class="ml-4 mb-2"
        v-if="get(exercise, 'status', '') == 0"
        :error="`Bạn chưa hoàn thiện nội dung bài tập`"
      />

      <div
        class="cc-box__body"
        :class="{ 'add-background': isAddQuestionForm, 'py-0': toggleFormAdd }"
      >
        <CreateQuestionChoice
          v-if="isAddQuestionForm && get(exercise, 'type', '') === 'CHOICE'"
          :exercise="exercise"
          @cancel="toggleFormAdd"
        />
        <CreateQuestionEssay
          v-if="isAddQuestionForm && get(exercise, 'type', '') === 'ESSAY'"
          :exercise="exercise"
          @cancel="toggleFormAdd"
        />
        <template v-if="isShowExercise">
          <ListQuestion
            v-for="(question, index) in get(exercise, 'questions', [])"
            :key="question.id"
            :index="index"
            :question="question"
            :exercise="exercise"
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
      description="Bạn có chắc chắc muốn xóa bài tập này?"
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
import CreateQuestionEssay from "~/components/page/course/create/exercise/CreateQuestionEssay";
import CreateQuestionChoice from "~/components/page/course/create/exercise/CreateQuestionChoice";
import ListQuestion from "~/components/page/course/create/exercise/ListQuestion";
import EditExerciseName from "~/components/page/course/create/exercise/EditExerciseName";
import UpdateExercise from "~/components/page/course/create/exercise/UpdateExercise";
import IconAngleUp from "~/assets/svg/design-icons/angle-up.svg?inline";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import IconDown from "~/assets/svg/icons/down.svg?inline";
import ExerciseInfo from "~/components/page/course/create/exercise/ExerciseInfo";

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
    EditExerciseName,
    IconAngleUp,
    IconPlus2,
    UpdateExercise,
    IconDown,
    ExerciseInfo,
    },

  props: {
    exercise: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: 0
    },
    lesson: Object
  },

  computed: {
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    }
  },

  data() {
    return {
      isAddQuestionForm: false,
      isShowExercise: true,
      isShowEditExercise: false,
      showModalConfirm: false,
      confirmLoading: false
    };
  },

  methods: {
    handleDeleteExercise() {
      if (this.disabled_all) return;
      this.showModalConfirm = true;
    },

    handleEditExercise() {
      if (this.disabled_all) return;
      this.isShowEditExercise = !this.isShowEditExercise;
    },

    toggleFormAdd() {
      if (this.disabled_all) return;
      this.isAddQuestionForm = !this.isAddQuestionForm;
    },

    async handleOk() {
      this.confirmLoading = true;
      const payload = {
        id: get(this, "exercise.id", "")
      };
      const result = await this.$store.dispatch(
        `elearning/creating/creating-excercises/${actionTypes.ELEARNING_CREATING_EXERCISES.DELETE}`,
        payload
      );
      this.handleCancel();
      if (get(result, "success", false)) {
        this.$toasted.success(get(result, "message", ""));
        const lesson_id = get(this, "lesson.id", "");
        this.$store.dispatch("elearning/create/getLesson", lesson_id);

        return;
      }
      this.$toasted.error(get(result, "message", ""));
    },

    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
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
