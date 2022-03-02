<template>
  <div class="cc-panel__body">
    <div class="mb-4">
      <h5 for="title" class="mb-3 d-inline-block">
        Tiêu đề bài tập
        <span class="caption text-base font-weight-normal"
          >(Tối đa 60 ký tự)</span
        >
      </h5>
      <app-input id="title" :counter="60" v-model="payload.title" />
    </div>

    <div class="mb-4">
      <h5 for="require" class="mb-3">Bài tập bắt buộc?</h5>

      <app-radio-group>
        <app-radio
          name="group1"
          value="1"
          class="mr-4"
          :checked="payload.required === true"
          @click="payload.required = true"
          >Có</app-radio
        >
        <app-radio
          name="group1"
          value="0"
          :checked="payload.required === false"
          @click="payload.required = false"
          >Không</app-radio
        >
      </app-radio-group>
    </div>

    <div class="mb-4">
      <h5 for="require" class="mb-3">Loại bài tập</h5>

      <app-radio-group>
        <app-radio
          name="group2"
          value="CHOICE"
          class="mr-4 disabled-input"
          :checked="payload.type === 'CHOICE'"
          :disabled="true"
          @click="payload.type = 'CHOICE'"
          >Trắc nghiệm</app-radio
        >
        <app-radio
          name="group2"
          value="ESSAY"
          class="disabled-input"
          :checked="payload.type === 'ESSAY'"
          :disabled="true"
          @click="payload.type = 'ESSAY'"
          >Tự luận</app-radio
        >
      </app-radio-group>
    </div>

    <div class="row align-items-center mb-4" v-show="payload.required">
      <div class="col-12 col-md-4">
        <label for="time" class="heading-5 font-weight-bold"
          >Thời gian làm bài</label
        >

        <app-input
          type="text"
          @onFocus="(event) => event.target.select()"
          class="mb-0 ce-input-with-unit mt-3"
          id="time"
          size="sm"
          style="width: 112px"
          v-model="payload.duration"
        >
          <div slot="unit">Phút</div>
        </app-input>
      </div>

      <div class="col-12 col-md-4">
        <label for="point" class="heading-5 font-weight-bold">Điểm đạt</label>

        <app-input
          type="text"
          @onFocus="(event) => event.target.select()"
          min="0"
          max="10"
          class="mb-0 ce-input-with-unit mt-3"
          id="point"
          size="sm"
          style="width: 102px"
          v-model="payload.pass_score"
        >
          <div slot="unit">/10</div>
        </app-input>
      </div>

      <div class="col-12 col-md-4">
        <label for="count" class="heading-5 font-weight-bold"
          >Số lần làm bài tối đa</label
        >

        <app-input
          type="text"
          class="mb-0 ce-input-with-unit mt-3"
          @onFocus="(event) => event.target.select()"
          id="count"
          size="sm"
          style="width: 102px"
          v-model="payload.reworks"
        >
          <div slot="unit">Lần</div>
        </app-input>
      </div>
    </div>

    <div class="d-flex justify-content-end">
      <app-button
        size="md"
        color="default"
        outline
        class="font-weight-semi-bold mr-4 text-secondary"
        @click="$emit('cancel')"
        >Huỷ</app-button
      >
      <app-button
        size="md"
        color="primary"
        class="font-weight-semi-bold"
        @click="handleUpdateExercise"
        :disabled="disabled_all"
        >Sửa bài tập</app-button
      >
    </div>
    <app-modal-confirm
      title="Bạn muốn sửa bài tập?"
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
import * as actionTypes from "~/utils/action-types";
import { getParamQuery, useEffect } from "~/utils/common";
import { get } from "lodash";
import { mapState } from "vuex";
import { createPayloadExercise } from "~/models/course/AddCourse";

export default {
  components: {
    IconAngleDown,
  },

  props: {
    lesson: {
      type: Object,
      default: null,
    },
    exercise: {},
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      progress: "progress",
    }),
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
    name() {
      return get(this, "general.type", "") === "COURSE"
        ? "khoá học"
        : "bài giảng";
    },
  },

  mounted() {
    useEffect(this, this.watchLessonAndExercise.bind(this), [
      "lesson",
      "exercise",
    ]);
  },

  data() {
    return {
      payload: {
        // index: 1,
        lesson_id: "",
        required: "",
        title: "",
        type: "",
        pass_score: 0,
        reworks: 1,
        id: "",
        duration: 0,
        category: this.category,
      },
      showModalConfirm: false,
      confirmLoading: false,
    };
  },

  methods: {
    watchLessonAndExercise() {
      this.payload = { ...this.exercise };
      this.payload.lesson_id = get(this, "lesson.id", "");
    },

    async handleUpdateExercise() {
      if (this.disabled_all) {
        this.$toasted.error(`${this.name} đã đăng, không được phép sửa`);
        return;
      }
      this.showModalConfirm = true;
    },

    async handleOk() {
      this.confirmLoading = true;

      this.payload.lesson_id = get(this, "lesson.id", "");

      let payload = { ...this.payload };
      delete payload.category;

      const res = await this.$axios({
        url: "elearning/creating/exercises",
        method: "PUT",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.handleCancel();
      if (get(res, "data.success", false)) {
        this.$toasted.success(get(res, "message", "Thành công"));
        const lesson_id = get(this, "lesson.id", "");
        this.$store.dispatch("elearning/create/getLesson", lesson_id);
        this.$emit("cancel");
        return;
      }

      this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
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
