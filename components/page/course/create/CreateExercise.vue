<template>
  <!-- <VclFacebook v-if="loading"></VclFacebook> -->
  <div>
    <div v-if="currentContent == 'createForm'">
      <div class="cc-panel mb-4 bg-white">
        <div class="cc-panel__title">
          <h4 class="cc-panel__heading">Bài tập</h4>
        </div>

        <div class="px-4 py-4">
          <app-alert type="info" class="" show-close>
            Bạn có thể tạo bài tập cho bài giảng/ khóa học của bạn tại đây. Nếu
            bài giảng/ khóa học của bạn không yêu cầu làm bài tập, bạn có thể bỏ
            qua phần này và tiến hành gửi lên để được xét duyệt.
          </app-alert>
        </div>
        <!-- Buttons -->
        <!-- <div v-if="lesson" class="pb-3"> -->
        <div class="pb-3">
          <ButtonCreateExercise
            v-if="isShowButtonCreate"
            @handleClick="handleShowFormAdd"
            :category="category"
          />
        </div>
      </div>

      <AddExercise
        v-if="isShowFormAdd"
        @cancel="handleCancelAddCreate"
        :lesson="lesson"
        :category="category"
        @addDone="handleDoneCreateExercise"
      />

      <!-- <div v-if="lesson"> -->
        <!-- <ExerciseList
          v-for="(exercise, index) in get(lesson, 'exercises', [])"
          :key="exercise.id"
          :lesson="lesson"
          :index="index"
          :exercise="exercise"
        /> -->
        <!-- <ExerciseList2 -->
          <!-- @editExercise="handleEditExercise" -->
        <!-- /> -->
        <!-- <SelectLesson
          :class="{ 'pb-3': isShowButtonCreate }"
          v-if="get(general, 'type', '') === 'COURSE'"
        /> -->
      <!-- </div> -->

      <div>
        <!-- <div class="create-action">
          <div class="create-action__right d-flex align-items-center">
            <app-button class="create-action__btn mr-4" @click="handleNextStep"
              ><Forward class="mr-2" /> Lưu & Tiếp tục</app-button
            >
          </div>
        </div> -->
        <app-modal-confirm
          centered
          v-if="showModalConfirm"
          :confirmLoading="false"
          @ok="handleOk"
          @cancel="handleCancel"
          title="Xác nhận"
          description="Bạn có chắc chắn là đã hoàn thành việc tạo bài tập?"
        />
      </div>
    </div>

    <EditExercise
      v-if="currentContent == 'editForm'"
      @goBack="closeEditForm"
      @upload="currentContent = 'uploadResource'"
      @cancel="cancelEditExercise"
      @updateExerciseDone="handleDoneUpdateExercise"
    />

    <div
      v-if="currentContent == 'createForm'"
    >
      <!-- <ExerciseList
        v-for="(exercise, index) in get(lesson, 'exercises', [])"
        :key="exercise.id"
        :lesson="lesson"
        :index="index"
        :exercise="exercise"
      />-->
      <ExerciseList2
        @editExercise="handleEditExercise"
        @deleteExerciseDone="handleAfterDeleteExercise"
      />
    </div>

    <UploadResourceManager v-if="currentContent == 'uploadResource'"/>

    <div>
      <app-modal-confirm
        centered
        v-if="showModalConfirm"
        :confirmLoading="false"
        @ok="handleOk"
        @cancel="handleCancel"
        title="Xác nhận"
        description="Bạn có chắc chắn là đã hoàn thành việc tạo bài tập?"
      />
    </div>
    <div class="create-action">
      <div class="create-action__right d-flex align-items-center">
        <app-button class="create-action__btn" @click="handleNextStep">
          <Forward class="mr-2" />
          Lưu & Tiếp tục
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
import IconInfoCircle from "~/assets/svg/design-icons/info-circle.svg?inline";
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconEditAlt from "~/assets/svg/design-icons/edit-alt.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconAlignCenterAlt from "~/assets/svg/design-icons/align-center-alt.svg?inline";
import IconFileCheck from "~/assets/svg/design-icons/file-check.svg?inline";
import IconClipboardNotes from "~/assets/svg/design-icons/clipboard-notes.svg?inline";
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import IconDelete from "~/assets/svg/v2-icons/delete_sweep_2.svg?inline";
import IconSave from "~/assets/svg/v2-icons/save_24px.svg?inline";
import Forward from "~/assets/svg/v2-icons/forward_2.svg?inline";
import { VclFacebook } from "vue-content-loading";
import ButtonCreateExercise from "~/components/page/course/create/exercise/ButtonCreateExercise";
import AddExercise from "~/components/page/course/create/exercise/AddExercise";
import ExerciseList from "~/components/page/course/create/exercise/ExerciseList";
import ExerciseList2 from "~/components/page/course/create/exercise/ExerciseList2";
import EditExercise from "~/components/page/course/create/exercise/EditExercise";
import SelectLesson from "~/components/page/course/create/exercise/SelectLesson";
import CreateAction from "~/components/page/course/create/common/CreateAction";
import UploadResourceManager from "~/components/page/course/create/exercise/UploadResourceManager"
import * as actionTypes from "~/utils/action-types";
import { getParamQuery, useEffect, redirectWithParams } from "~/utils/common";
import { get } from "lodash";
import { mapState, mapActions } from "vuex";
import { CATEGORY_TEST, PAGE_SIZE } from "~/utils/constants";

const EXAM_STORE = `elearning/manager/bank/exam`;
const EXERCISE_CREATING_STORE = 'elearning/creating/creating-excercises';
const EXERCISES_CREATING_STORE = 'elearning/create';
const QUESTION_CREATING_STORE = "elearning/creating/creating-question"; // to CRUD question into bank

export default {
  components: {
    IconInfoCircle,
    IconAngleDown,
    IconEditAlt,
    IconTrashAlt,
    IconAlignCenterAlt,
    IconFileCheck,
    IconClipboardNotes,
    CreateAction,
    ButtonCreateExercise,
    AddExercise,
    ExerciseList,
    SelectLesson,
    IconPlus2,
    IconAngleDown,
    IconDelete,
    IconDelete,
    Forward,
    IconSave,
    VclFacebook,
    ExerciseList2,
    EditExercise,
    UploadResourceManager
  },

  mounted() {
    useEffect(this, this.handleChangeGeneral.bind(this), [
      "general",
      "lessons"
    ]);
  },

  watch: {
    '$route.query': function(newQuery, oldQuery) {
    }
  },

  data() {
    return {
      isShowButtonCreate: true,
      isShowFormAdd: false,
      category: "EXERCISE",
      loading: false,
      showModalConfirm: false,
      currentContent: 'createForm' // editForm | createForm | uploadResource
    };
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      lesson: "lesson",
      lessons: "lessons",
      progress: "progress"
    }),
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
    name() {
      return get(this, "general.type", "") === "COURSE"
        ? "khoá học"
        : "bài giảng";
    }
  },

  methods: {
    ...mapActions(EXERCISES_CREATING_STORE, {
      getExerciseList: 'getExercises'
    }),
    ...mapActions(EXERCISE_CREATING_STORE, {
      getExerciseDetail: actionTypes.ELEARNING_CREATING_EXERCISES.DETAIL
    }),
    ...mapActions(QUESTION_CREATING_STORE, {
      getQuestionsOfExercise: actionTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK.LIST
    }),
    handleCancel() {
      if (this.disabled_all) return;
      this.showModalConfirm = false;
    },

    handleOk() {
      if (this.disabled_all) return;
      this.showModalConfirm = false;
      this.$emit("nextStep", "exam");
    },

    async handleChangeGeneral() {
      if (get(this, "general.type", "") === "LECTURE") {
        this.loading = true;
        const lesson_id = get(this, "lessons.0.id", "");
        await this.$store.dispatch("elearning/create/getLesson", lesson_id);
        this.loading = false;
        return;
      }
      this.$store.dispatch("elearning/create/getLesson", "");
    },

    handleShowFormAdd() {
      if (this.disabled_all) return;
      this.isShowButtonCreate = false;
      this.isShowFormAdd = true;
    },

    handleCancelAddCreate() {
      if (this.disabled_all) return;
      this.isShowButtonCreate = true;
      this.isShowFormAdd = false;
    },

    handleNextStep() {
      if (this.disabled_all) {
        this.$toasted.error(`${this.name} đã đăng, không được phép sửa`);
        return;
      }
      this.showModalConfirm = true;
    },
    handleDoneCreateExercise() {
      if (this.disabled_all) return;
      this.isShowButtonCreate = true;
      this.isShowFormAdd = false;
    },
    async handleDoneUpdateExercise() {
      const params = {
        elearning_id: getParamQuery('elearning_id'),
        active_section: getParamQuery('active_section'),
        active_content: 'create-form',
      }
      redirectWithParams(params);
      await this.refreshData();
    },
    async handleEditExercise(data) {
      await Promise.all([
        // Get detail of current exercise
        this.getExerciseDetail(data.id),
        // Get list questions of exercise
        this.getQuestionsOfExercise({
          parent_id: data.id,
          parent: "TEST",
          size: PAGE_SIZE.MAXIMIZE
        })
      ]);
      const params = {
        elearning_id: getParamQuery('elearning_id'),
        active_section: getParamQuery('active_section'),
        active_content: 'edit-form',
        exercise_id: data.id
      }
      redirectWithParams(params);
      this.currentContent = 'editForm';
    },
    
    async closeEditForm() {
      const query = {
        elearning_id: getParamQuery('elearning_id'),
        active_section: getParamQuery('active_section'),
        active_content: 'create-form'
      };
      redirectWithParams(query);
      await this.refreshData();
      this.currentContent = 'createForm';
    },
    async cancelEditExercise() {
      const query = {
        elearning_id: getParamQuery('elearning_id'),
        active_section: getParamQuery('active_section'),
        active_content: 'create-form'
      };
      redirectWithParams(query);
      this.currentContent = 'createForm';
    },
    async setCurrentContent() {
      const currentContent = get(this, '$route.query.active_content', false);
      const currentSection = get(this, '$route.query.active_section', false);
      if (currentContent == 'edit-form' && currentSection == 'exercise') {
        if (get(this, '$route.query.exercise_id', false)) {
          const exerciseId = get(this, '$route.query.exercise_id')
          await Promise.all([
            // Get detail of current exercise
            this.getExerciseDetail(exerciseId),
            // Get list questions of exercise
            this.getQuestionsOfExercise({
              parent_id: exerciseId,
              parent: "TEST",
              size: PAGE_SIZE.MAXIMIZE
            })
          ]);
          this.currentContent = 'editForm';

        }
      }
    },
    async refreshData() {
      await Promise.all([
        this.fetchExerciseList()
      ])
    },
    async fetchData() {
      await this.fetchExerciseList();
    },
    async fetchExerciseList() {
      const elearningId = getParamQuery('elearning_id');
      const params = {
        category: CATEGORY_TEST.EXERCISE,
        parent: "ELEARNING",
        parent_id: elearningId,
        size: PAGE_SIZE.MAXIMIZE,
        show_statistic: true,
      };
      await this.getExerciseList(params);
    },
    async handleAfterDeleteExercise() {
      await this.fetchExerciseList();
    },
    get,
  },
  async created() {
    await this.fetchData();
    this.setCurrentContent();
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_create-exercise.scss";
</style>
