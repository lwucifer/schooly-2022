<template>
  <div class="">
    <div class="mb-4">
      <h5 for="title" class="mb-3 d-inline-block">
        Tiêu đề bài tập
        <span class="caption text-base font-weight-normal">(Tối đa 60 ký tự)</span>
      </h5>
      <app-input
        id="title"
        class="mb-0"
        placeholder="Nhập tiều đề bài tập"
        @input="checkTitle()"
        :counter="60"
        v-model="payload.title"
      />
      <app-error :error="get(error, 'title', '')" />
    </div>

    <div class="mb-3">
      <div class="row">
        <div class="col-3">
          <div>
            <h5 for="require" class="mb-3">Bài tập bắt buộc?</h5>

            <app-radio-group style="height: 4.2rem;">
              <app-radio
                name="group2"
                @change="checkRequired()"
                value="1"
                class="mr-4"
                :checked="payload.required === 1"
                @click="payload.required = 1"
              >Có</app-radio>
              <app-radio
                name="group2"
                value="0"
                @change="checkRequired()"
                :checked="payload.required === 0"
                @click="payload.required = 0"
              >Không</app-radio>
            </app-radio-group>
            <app-error :error="get(error, 'required', '')" />
          </div>
        </div>

        <div class="col-9">
          <div>
            <h5 for="require" class="mb-3">Bài tập thuộc?</h5>
            <div class="row">
              <!-- <app-radio-group style="height: 4.2rem;"> -->
                <app-radio
                  class="col-md-4"
                  :checked="checkRadio == 'elearning'"
                  name="checkType"
                  @input="switchSource('elearning')"
                  >Bài giảng khóa học</app-radio
                >
                <app-radio
                  class="col-md-4"
                  :checked="checkRadio == 'clsgroup'"
                  name="checkType"
                  @input="switchSource('clsgroup')"
                  >Lớp - Nhóm</app-radio
                >
              <!-- </app-radio-group> -->
            </div>
          </div>
        </div>

        <div class="col-md-3 col-12">
          <div class="mb-3">
            <h5 for="require" class="mb-3">Chọn loại bài tập</h5>
            <app-select
              :options="typeOpts"
              v-model="payload.type"
              placeholder="Loại bài tập"
              bordered
              class="w-100"
              @change="checkType"
            ></app-select>
            <app-error :error="get(error, 'type', '')" />
          </div>
        </div>

        <div v-if="checkRadio == 'elearning'" class="col-md-5 col-12">
          <div>
            <h5 for="require" class="mb-3">Thuộc</h5>
            <app-select-elearnings
              style="height: 4.2rem;"
              @input="handleSelectElearning"
              v-model="selectedElearning"
            ></app-select-elearnings>
            <app-error :error="get(error, 'elearning', '')" />
          </div>
        </div>
        
        <div
          v-if="checkRadio == 'elearning'"
          class="col-md-4 col-12"
        >
          <div>
            <h5 for="require" class="mb-3" style="opacity: 0;">Bài học</h5>
            <select-lesson
              @change="handleSelectLesson"
              :disabled="isLoaddingLessons ||
                this.selectedElearning == null"
            >
            </select-lesson>
            <app-error :error="get(error, 'lesson', '')" />
          </div>
        </div>

        <div v-if="checkRadio == 'clsgroup'" class="col-md-9 col-12">
          <div>
            <h5 for="require" class="mb-3">Thuộc</h5>
            <div class="cex__select-item">
              <app-select-class-group
                style="height: 4.2rem;"
                class="app-vue-select form-item__selection"
                @input="handleChangedClassGroup"
              ></app-select-class-group>
            </div>
            
            <app-error :error="get(error, 'clsgroup', '')" />
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4" v-if="payload.required">
      <div class="col-12 col-md-3">
        <label for="time" class="heading-5 font-weight-bold"><h5>Thời gian làm bài</h5></label>

        <app-input
          type="text"
          @onFocus="(event) => event.target.select()"
          class="mb-0 ce-input-with-unit mt-3"
          id="time"
          size="md"
          style="width: 12rem;"
          v-model="payload.duration"
          @change="checkDuration()"
        >
          <div slot="unit">Phút</div>
        </app-input>
        <app-error :error="get(error, 'duration', '')" />
      </div>

      <div class="col-12 col-md-3">
        <label for="point" class="heading-5 font-weight-bold text-dark">Điểm đạt</label>

        <app-input
          type="text"
          @onFocus="(event) => event.target.select()"
          min="0"
          @change="checkPassScore()"
          max="10"
          class="mb-0 ce-input-with-unit mt-3"
          id="point"
          size="md"
          style="width: 12rem;"
          v-model="payload.pass_score"
        >
          <div slot="unit">/10</div>
        </app-input>
        <app-error :error="get(error, 'pass_score', '')" />
      </div>

      <div class="col-12 col-md-3">
        <label for="count" class="heading-5 font-weight-bold text-dark">Số lần làm bài tối đa</label>

        <app-input
          type="text"
          class="mb-0 ce-input-with-unit mt-3"
          @onFocus="(event) => event.target.select()"
          id="count"
          size="md"
          style="width: 12rem;"
          v-model="payload.reworks"
          @change="checkReworks()"
        >
          <div slot="unit">Lần</div>
        </app-input>
        <app-error :error="get(error, 'reworks', '')" />
      </div>
    </div>

    <div class="row align-items-center mb-4" v-else-if="payload.required !== ''">
      <div v-if="isEdittingCourse" class="col-12 col-md-4">
        <label for="time" class="heading-5 font-weight-bold text-dark">Thời gian làm bài</label>

        <app-input
          type="text"
          @onFocus="(event) => event.target.select()"
          class="mb-0 ce-input-with-unit mt-3"
          id="time"
          size="md"
          style="width: 12rem;"
          v-model="payload.duration"
          @change="checkDuration()"
        >
          <div slot="unit">Phút</div>
        </app-input>
        <app-error :error="get(error, 'duration', '')" />
      </div>

      <div v-if="isEdittingCourse" class="col-12 col-md-4">
        <label for="count" class="heading-5 font-weight-bold">Số lần làm bài tối đa</label>

        <app-input
          type="text"
          class="mb-0 ce-input-with-unit mt-3"
          @onFocus="(event) => event.target.select()"
          id="count"
          size="md"
          style="width: 12rem;"
          v-model="payload.reworks"
          @change="checkReworks()"
        >
          <div slot="unit">Lần</div>
        </app-input>
        <app-error :error="get(error, 'reworks', '')" />
      </div>
    </div>

    <div class="d-flex justify-content-end">
      <app-button
        size="md"
        color="default"
        outline
        class="font-weight-semi-bold mr-4 text-secondary"
        @click="$emit('cancel')"
      >Huỷ</app-button>
      <app-button
        size="md"
        color="primary"
        class="font-weight-semi-bold"
        @click="handleAddExcercise"
        :disabled="disabled_all"
      >Tạo bài tập</app-button>
    </div>
    <app-modal-confirm
      title="Bạn muốn tạo bài tập?"
      description="Bạn sẽ không thể thay đổi loại bài tập sau khi tạo."
      centered
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    />
  </div>
</template>

<script>
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import AppSelectElearnings from "~/components/common/select/AppSelectElearnings";
import * as actionTypes from "~/utils/action-types";
import { getParamQuery, remove_unicode } from "~/utils/common";
import { get } from "lodash";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { createPayloadExercise } from "~/models/course/AddCourse";
import SelectLesson from "~/components/page/course/create/exercise/v2/SelectLesson";

const STORE_NAME_CREATING_EXCERCISES = "elearning/creating/creating-excercises";
const EXAM_STORE = `elearning/manager/bank/exam`;
const STORE_NAME_TEST_SETTING = `elearning/test/setting`;
const EXERCISES_CREATING_STORE = 'elearning/create';

import { CATEGORY_TEST, PAGE_SIZE } from "~/utils/constants";

export default {
  components: {
    IconAngleDown,
    SelectLesson,
    AppSelectElearnings
  },

  props: {
    lesson: {
      type: Object,
      default: null,
    },
    category: {
      type: String,
      default: "",
    },
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
    }),
    // ...mapState("elearning/creating/creating-excercises", {
    //   selectedElearning: "currentElearningForCreating",
    // }),
    ...mapState("elearning/study-group/group", {
      classes: "classes",
      groups: "groups",
      teacher: "teacher",
    }),
    ...mapGetters("auth", ["organizationId", "assignableCheck"]),
    classList() {
      console.log("[classList]", this.classes);
      return this.classes && this.classes.filter(item => !item.homeroom);
    },
    classGroup() {
      return this.groups && this.groups.content && this.groups.content.filter(item => !item.is_hidden);
    },
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
    isEdittingCourse() {
      return get(this, 'general.type', '') === 'COURSE'
    },
    isEdittingLecture() {
      return get(this, 'general.type', '') === 'LECTURE'
    }
  },

  data() {
    return {
      checkRadio: "elearning",
      selectedElearning: null,
      payload: {
        // index: 1,
        lesson_id: "",
        required: "",
        title: "",
        type: null,
        pass_score: 0,
        reworks: "",
        duration: "",
        category: 'EXERCISE',
        assign_class_ids: [],
        assign_group_ids: []
      },
      error: {
        title: "",
        required: "",
        type: "",
        duration: "",
        pass_score: "",
        reworks: "",
        elearning: "",
        lesson: "",
        clsgroup: "",
      },
      filterClass: null,
      filterClassGroup: null,
      showModalConfirm: false,
      confirmLoading: false,
      typeOpts: [
        { text: "Tự luận", value: "ESSAY" },
        { text: "Trắc nghiệm", value: "CHOICE" },
        { text: "Hỗn hợp", value: "MIX" },
      ],
      isLoaddingLessons: false
    };
  },

  watch: {
    selectedElearning(newVal, oldVal) {
      this.getLessonList();
    }
  },
  methods: {
    ...mapActions(EXAM_STORE, {
      bankExamAdd: "bankExamAdd",
    }),
    ...mapActions(EXERCISES_CREATING_STORE, {
      getExercises: "getExercises",
    }),
    ...mapActions('elearning/creating/creating-lesson', {
      getLessonsByElearning: 'elearningCreatingLessonsList'
    }),
    ...mapActions(STORE_NAME_TEST_SETTING, ["addSettingTest"]),
    ...mapMutations("elearning/creating/creating-excercises", {
      setSelectedElearning: "setCurrentElearningForCreating",
    }),
    checkPayload() {
      const title = this.checkTitle();
      const duration = this.checkDuration();
      const pass_score = this.checkPassScore();
      const reworks = this.checkReworks();
      const type = this.checkType();
      const required = this.checkRequired();
      const elearning = this.checkElearning();
      const lesson = this.checkLesson();
      const cls_group = this.checkClsGroup();
      return title && duration && pass_score && reworks && type && required && elearning && lesson && cls_group;
    },

    checkTitle() {
      if (!this.payload.title) {
        this.error.title = "Tiêu đề bài tập không được để trống";
        return false;
      }

      if(this.payload.title.length > 60) {
        this.error.title = "Tiêu đề bài tập dài tối đa 60 ký tự";
        return false;
      }
      this.error.title = "";
      return true;
    },

    checkDuration() {
      if (this.payload.required === 0) {
        this.error.duration = "";
        return true;
      }
      if (this.payload.duration === "") {
        this.error.duration = "Thời gian làm bài không được để trống";
        return false;
      }
      if (this.payload.duration < 0) {
        this.error.duration = "Thời gian làm bài không được nhỏ hơn 0";
        return false;
      }
      this.error.duration = "";
      return true;
    },

    checkPassScore() {
      if (this.payload.required === 0) {
        this.error.pass_score = "";
        return true;
      }
      if (this.payload.pass_score === "") {
        this.error.pass_score = "Điểm đạt không được để trống";
        return false;
      }
      if(this.payload.pass_score < 0 || this.pass_score > 10) {
        this.error.pass_score = "Điểm đạt nằm trong khoảng 0 đến 10";
        return false
      }
      this.error.pass_score = "";
      return true;
    },

    checkReworks() {
      if (this.payload.required === 0) {
        this.error.reworks = "";
        return true;
      }
      if (this.payload.reworks === "") {
        this.error.reworks = "Số lần làm bài không được để trống";
        return false;
      }

      if (this.payload.reworks < 0) {
        this.error.reworks = "Số lần làm bài không được nhỏ hơn 0";
        return false;
      }
      this.error.reworks = "";
      return true;
    },

    checkType() {
      if (this.payload.type === null) {
        this.error.type = "Loại bài tập không được để trống";
        return false;
      }
      this.error.type = "";
      return true;
    },

    checkRequired() {
      if (this.payload.required === "") {
        this.error.required = "Bài tập bắt buộc không được để trống";
        return false;
      }
      this.error.required = "";
      return true;
    },

    checkPassScore() {
      if (this.payload.required === 0) {
        this.error.pass_score = "";
        return true;
      }
      if (this.payload.pass_score === "") {
        this.error.pass_score = "Điểm đạt không được để trống";
        return false;
      }
      if(this.payload.pass_score < 0 || this.pass_score > 10) {
        this.error.pass_score = "Điểm đạt nằm trong khoảng 0 đến 10";
        return false
      }
      this.error.pass_score = "";
      return true;
    },

    checkElearning() {
      if (this.checkRadio == 'elearning') {
        if (get(this, 'selectedElearning', null) == null) {
          this.error.elearning = "Bài giảng/khóa học bắt buộc không được để trống";
          return false;
        }
      }
      this.error.elearning = "";
      return true;
    },

    checkClsGroup() {
      if (this.checkRadio == 'clsgroup') {
        if (
          get(this, 'payload.assign_class_ids', []).length <= 0 &&
          get(this, 'payload.assign_group_ids', []).length <= 0
        ) {
          this.error.clsgroup = "Lớp/Nhóm học tập bắt buộc không được để trống";
          return false;
        }
      }
      this.error.clsgroup = "";
      return true;
    },

    checkLesson() {
      if (this.checkRadio == 'elearning') {
        if (this.selectedElearning != null) {
          if (this.payload.lesson_id === "") {
            this.error.lesson = "Bài học bắt buộc không được để trống";
            return false;
          }
        }
      }
      this.error.lesson = "";
      return true;
    },

    async handleAddExcercise() {
      if (!this.checkPayload()) {
        this.$toasted.error("Tham số không hợp lệ");
        return;
      }
      this.showModalConfirm = true;
    },

    async handleOk() {
      this.confirmLoading = true;
      const body = new FormData();
      body.append("category", this.payload.category);
      body.append("parent", this.checkRadio == 'elearning' ? "ELEARNING" : 'ASSIGN');
      body.append("parent_id", this.checkRadio == 'elearning' ? get(this, 'selectedElearning', '') : null);
      body.append("lesson_id", get(this, 'payload.lesson_id', null));
      body.append("name", this.payload.title);
      body.append("type", this.payload.type);
      body.append("required", get(this, 'payload.required', false));
      body.append("works", get(this, 'payload.reworks', 1));
      body.append("passing_score", get(this, 'payload.pass_score', 0));
      body.append("duration", get(this, 'payload.duration', 0));
      body.append("assign_class_ids", get(this, 'payload.assign_class_ids', []));
      body.append("assign_group_ids", get(this, 'payload.assign_group_ids', []));
      // if (this.general && this.general.subject && this.general.subject.id) {
      //   body.append("subject_id", this.general.subject.id);
      // }
      // if (this.general && this.general.grade && this.general.grade.id) {
      //   body.append("grade_id", this.general.grade.id);
      // }
      const result = await this.bankExamAdd(body);
      if (result.success) {
        this.$toasted.success('Thành công');
        this.$emit('addDone', get(result, 'data', {}));
      } else {
        this.$toasted.error(result.message);
      }
      this.handleCancel();
    },

    async handleSelectElearning(val) {
      // await this.setSelectedElearning(val);
      this.selectedElearning = val;
      this.checkElearning();
      this.payload.lesson_id = "";
    },
    handleSelectLesson(val) {
      this.payload.lesson_id = val;
      this.checkLesson();
    },
    handleChangedClassGroup(val) {
      const list = val;
      const valSize = list.length;
      let groups = [], classes = [];
      for (let i = 0; i < valSize; i++) {
        const tmp = list[i];
        if (get(tmp, 'type', '') == 'GROUP') {
          groups.push(tmp);
        }
        if (get(tmp, 'type', '') == 'CLASS') {
          classes.push(tmp);
        }
      }
      const groupIds = groups.map(item => item.id);
      const classIds = classes.map(item => item.id);
      this.payload.assign_group_ids = groupIds;
      this.payload.assign_class_ids = classIds;
      this.checkClsGroup();
    },
    async getLessonList() {
      try {
        this.isLoaddingLessons = true;
        let params = {
          elearning_id: this.selectedElearning
        };
        const res = await this.getLessonsByElearning(
          {
            params: params
          }
        );
      } catch (error) {

      } finally {
        this.isLoaddingLessons = false;
      }
    },
    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },
    switchSource(source) {
      this.checkRadio = source;
      this.payload.assign_class_ids = [];
      this.payload.assign_group_ids = [];
    },
    getCurrentSource() {
      const elearningId = getParamQuery('elearning_id');
      if (elearningId) {
        this.checkRadio = 'elearning';
        this.selectedElearning = elearningId
      }
    },
    get,
  },
  async created() {
    const params = {
      school_id: get(this, "organizationId", ""),
      type: "CLASS"
    };
    await Promise.all([
      this.$store.dispatch("elearning/study-group/group/getClassesAssignment", params),
      this.$store.dispatch(
        `elearning/study-group/group/${actionTypes.STUDY_GROUP.LIST}`,
        params
      )
    ]);
    this.getCurrentSource();
  }
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/course/creat/_form-creat-excercise.scss";
</style>
