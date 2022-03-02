<template>
  <div class="ce-item__left d-flex align-items-center">
    <div class="mr-3">
      <input
        v-if="isEditExerciseName"
        v-model="exerciseNameModel"
        ref="inputExerciserName"
        class="cc-box__input-title bg-white mb-0"
        type="text"
        maxlength="80"
      />
      <h2 class="cc-box__title heading-6" v-else>
        Bài {{ index + 1 }}:
        {{
          exerciseNameModel.length > 40
            ? exerciseNameModel.slice(0, 40) + "..."
            : exerciseNameModel
        }}
      </h2>
    </div>

    <template v-if="isEditExerciseName">
      <button
        class="cc-box__btn mr-4 text-success d-flex align-items-center w-50"
        @click="handleSaveExerciseName"
      >
        <IconSave24px class="mr-2 fill-primary" /> Lưu
      </button>
      <button
        class="cc-box__btn mr-3 text-secondary d-flex align-items-center w-50"
        @click="cancelEditExerciseName"
      >
        <IconClose class="mr-2 fill-secondary" /> Huỷ
      </button>
    </template>

    <template v-else>
      <button
        class="cc-box__btn cc-box__btn-edit-hover mr-4"
        @click="editExerciseName"
      >
        <IconEditAlt class="icon d-block subheading fill-primary" />
      </button>
      <button
        class="cc-box__btn cc-box__btn-edit-hover"
        @click="handleDeleteExam"
      >
        <IconTrashAlt
          class="d-block subheading fill-secondary"
          width="20px"
          height="20px"
        />
      </button>
    </template>
    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    />
  </div>
</template>

<script>
import { get } from "lodash";
import IconEditAlt from "~/assets/svg/v2-icons/edit.svg?inline";
const IconTrashAlt = () =>
  import("~/assets/svg/design-icons/trash-alt.svg?inline");
import IconClose from "~/assets/svg/icons/close.svg?inline";
import IconSave24px from "~/assets/svg/v2-icons/save_24px.svg?inline";
import { mapState } from "vuex";
import { getParamQuery } from "~/utils/common";
import { createPayloadExercise } from "~/models/course/AddCourse";
import * as actionTypes from "~/utils/action-types";

export default {
  components: {
    IconEditAlt,
    IconTrashAlt,
    IconClose,
    IconSave24px,
  },
  props: {
    exam: {
      type: Object,
      default: null,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState("elearning/create", {
      general: "general",
    }),
    ...mapState("elearning/create", {
      lesson: "lesson",
    }),
  },

  data() {
    return {
      isEditExerciseName: false,
      exerciseNameModel: get(this, "exam.title", ""),
      showModalConfirm: false,
      confirmLoading: false,
    };
  },
  watch: {
    exercise: {
      handler: function() {
        this.exerciseNameModel = this.exam.title;
      },
      deep: true,
    },
  },
  methods: {
    get,
    editExerciseName() {
      this.isEditExerciseName = true;
      const timeout = setTimeout(() => {
        this.$refs.inputExerciserName.focus();
        clearTimeout(timeout);
      });
    },
    cancelEditExerciseName() {
      this.isEditExerciseName = false;
      this.exerciseNameModel = get(this, "exam.title", "");
    },
    async handleSaveExerciseName() {
      const data = {
        id: get(this, "exam.id", ""),
        title: this.exerciseNameModel,
        category: "TEST",
      };

      const res = await this.$axios({
        url: "/elearning/creating/test",
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });

      if (get(res, "data.success", false)) {
        this.$toasted.success(get(res, "data.message", ""));
        this.isEditExerciseName = false;
        this.$store.dispatch("elearning/create/getExams");
        return;
      }
      this.$toasted.error(get(res, "data.message", ""));
    },
    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },
    handleDeleteExam() {
      this.showModalConfirm = true;
    },
    async handleOk() {
      this.confirmLoading = true;
      const payload = {
        id: get(this, "exam.id", ""),
      };

      const res = await this.$axios({
        url: "/elearning/creating/test",
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      });

      this.handleCancel();
      if (get(res, "data.success", false)) {
        this.$toasted.success(get(res, "data.message", ""));
        this.$store.dispatch("elearning/create/getExams");
        return;
      }
      this.$toasted.error(get(res, "data.message", ""));
    },
  },
};
</script>

<style></style>
