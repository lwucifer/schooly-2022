<template>
  <sub-block-section
    title="Bài tập"
    :content-cls="{ 'pb-3': true, 'px-0': true, 'mb-0': true, 'pt-2': true }"
  >
    <template v-slot:content>
      <div class="cc-panel__body">
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

        <div class>
          <div class="row">
            <div class="col-md-3 col-12">
              <div class="mb-4">
                <h5 for="require" class="mb-3">Chọn loại bài tập</h5>
                <app-select
                  :options="typeOpts"
                  v-model="payload.type"
                  placeholder="Loại bài tập"
                  bordered
                  class="w-100"
                ></app-select>

                <!-- <app-radio-group>
                  <app-radio
                    name="group2"
                    value="CHOICE"
                    @change="checkType()"
                    class="mr-4"
                    :checked="payload.type === 'CHOICE'"
                    @click="payload.type = 'CHOICE'"
                    >Trắc nghiệm</app-radio
                  >
                  <app-radio
                    name="group2"
                    @change="checkType()"
                    value="ESSAY"
                    :checked="payload.type === 'ESSAY'"
                    @click="payload.type = 'ESSAY'"
                    >Tự luận</app-radio
                  >
                </app-radio-group>-->
                <app-error :error="get(error, 'type', '')" />
              </div>
            </div>

            <div class="col-md-9 col-12">
              <div
                class="mb-4"
                v-show="category === 'EXERCISE' && isEdittingLecture"
              >
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

              <div
                class="mb-4"
                v-show="category === 'EXERCISE' && isEdittingCourse "
              >
                <h5 for="require" class="mb-3">Chọn bài học liên quan</h5>

                <SelectLesson />
                <app-error :error="get(error, 'required', '')" />
              </div>
            </div>
          </div>
        </div>

        <div class="mb-4" v-show="category === 'EXERCISE' && isEdittingCourse">
          <h5 for="require" class="mb-3">Bài tập bắt buộc?</h5>
          <app-radio-group style="height: 4.2rem;">
            <app-radio
              name="group1"
              @change="checkRequired()"
              value="1"
              class="mr-4"
              :checked="payload.required === 1"
              @click="payload.required = 1"
            >Có</app-radio>
            <app-radio
              name="group1"
              value="0"
              @change="checkRequired()"
              :checked="payload.required === 0"
              @click="payload.required = 0"
            >Không</app-radio>
          </app-radio-group>

          <app-error :error="get(error, 'required', '')" />
        </div>

        <!-- <div class="mb-4">
          <h5 for="require" class="mb-3">Loại bài tập</h5>

          <app-radio-group>
            <app-radio
              name="group2"
              value="CHOICE"
              @change="checkType()"
              class="mr-4"
              :checked="payload.type === 'CHOICE'"
              @click="payload.type = 'CHOICE'"
              >Trắc nghiệm</app-radio
            >
            <app-radio
              name="group2"
              @change="checkType()"
              value="ESSAY"
              :checked="payload.type === 'ESSAY'"
              @click="payload.type = 'ESSAY'"
              >Tự luận</app-radio
            >
          </app-radio-group>
          <app-error :error="get(error, 'type', '')" />
        </div>-->

        <div class="row align-items-center mb-4" v-if="payload.required">
          <div class="col-12 col-md-4">
            <label for="time" class="heading-5 font-weight-bold">Thời gian làm bài</label>

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

          <div class="col-12 col-md-4">
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

          <div class="col-12 col-md-4">
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
  </sub-block-section>
</template>

<script>
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import * as actionTypes from "~/utils/action-types";
import { getParamQuery, remove_unicode } from "~/utils/common";
import { get } from "lodash";
import { mapState, mapActions } from "vuex";
import { createPayloadExercise } from "~/models/course/AddCourse";
import SelectLesson from "~/components/page/course/create/exercise/SelectLesson";
const STORE_NAME_CREATING_EXCERCISES = "elearning/creating/creating-excercises";
const EXAM_STORE = `elearning/manager/bank/exam`;
const STORE_NAME_TEST_SETTING = `elearning/test/setting`;
const EXERCISES_CREATING_STORE = 'elearning/create';

import { CATEGORY_TEST, PAGE_SIZE } from "~/utils/constants";

export default {
  components: {
    IconAngleDown,
    SelectLesson,
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
      payload: {
        // index: 1,
        lesson_id: "",
        required: "",
        title: "",
        type: null,
        pass_score: 0,
        reworks: "",
        duration: "",
        category: this.category,
      },
      error: {
        title: "",
        required: "",
        type: "",
        duration: "",
        pass_score: "",
        reworks: "",
      },
      showModalConfirm: false,
      confirmLoading: false,
      typeOpts: [
        { text: "Tự luận", value: "ESSAY" },
        { text: "Trắc nghiệm", value: "CHOICE" },
        { text: "Hỗn hợp", value: "MIX" },
      ],
    };
  },

  methods: {
    ...mapActions(EXAM_STORE, {
      bankExamAdd: "bankExamAdd",
    }),
    ...mapActions(EXERCISES_CREATING_STORE, {
      getExercises: "getExercises",
    }),
    ...mapActions(STORE_NAME_TEST_SETTING, ["addSettingTest"]),
    checkPayload() {
      const title = this.checkTitle();
      const duration = this.checkDuration();
      const pass_score = this.checkPassScore();
      const reworks = this.checkReworks();
      const type = this.checkType();
      const required = this.checkRequired();
      return title && duration && pass_score && reworks && type && required;
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

    async handleAddExcercise() {
      if (!this.checkPayload()) {
        this.$toasted.error("Tham số không hợp lệ");
        return;
      }
      this.showModalConfirm = true;
    },

    async handleOk() {
      this.confirmLoading = true;

      // this.payload.lesson_id = get(this, "lesson.id", "");

      // const payload = createPayloadExercise(this.payload);
      // const res = await this.$store.dispatch(
      //   `elearning/creating/creating-excercises/${actionTypes.ELEARNING_CREATING_EXERCISES.ADD}`,
      //   payload
      // );

      const body = new FormData();
      body.append("category", this.payload.category);
      body.append("parent", "ELEARNING");
      body.append("parent_id", getParamQuery('elearning_id'));
      body.append("lesson_id", get(this, 'lesson.id', ''));
      body.append("name", this.payload.title);
      body.append("type", this.payload.type);
      body.append("required", get(this, 'payload.required', false));
      body.append("works", get(this, 'payload.reworks', 1));
      body.append("passing_score", get(this, 'payload.pass_score', 0));
      body.append("duration", get(this, 'payload.duration', 0));
      if (this.general && this.general.subject && this.general.subject.id) {
        body.append("subject_id", this.general.subject.id);
      }
      if (this.general && this.general.grade && this.general.grade.id) {
        body.append("grade_id", this.general.grade.id);
      }
      const result = await this.bankExamAdd(body);
      if (result.success) {
        this.$toasted.success('Thành công');
        await Promise.all([
          this.getExercises({
            category: CATEGORY_TEST.EXERCISE,
            parent: "ELEARNING",
            parent_id: getParamQuery("elearning_id"),
            size: PAGE_SIZE.MAXIMIZE
          }),
        ])
        this.$emit('addDone');
      } else {
        this.$toasted.error(result.message);
      }

      this.handleCancel();
    },

    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },
    get,
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/elearning/course/creat/_form-creat-excercise.scss";
</style>
