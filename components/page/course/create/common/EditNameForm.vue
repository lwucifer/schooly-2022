<template>
  <div class="crc__edit-name-form d-flex align-items-center w-100">
    <div class="mr-3" :class="{ 'w-100': isEditting }">
      <input
        v-if="isEditting"
        v-model="nameForm"
        ref="inputExerciserName"
        class="cc-box__input-title bg-white mb-0"
        :class="{ 'w-100': isEditting }"
        type="text"
        maxlength="80"
      />
      <h2 class="cc-box__title heading-6" v-else>{{ nameForm | truncStrFilter(80) }}</h2>
    </div>

    <div v-if="isEditting" class="d-flex align-items-center">
      <button class="px-3 font-weight-medium text-primary" @click="saveForm">Lưu</button>
      <button class="px-3 text-gray" @click="cancelEditForm">Huỷ</button>
    </div>

    <div v-else>
      <button class @click="activeEditForm">
        <IconEditAlt class="icon d-block subheading fill-primary crc__edit-icon" />
      </button>
    </div>
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
    name: {
      type: String,
      default: "",
    },
  },
  computed: {},

  data() {
    return {
      isEditting: false,
      nameForm: this.name,
      showModalConfirm: false,
      confirmLoading: false,
      nameDefault: this.name,
    };
  },
  watch: {
    nameForm(val) {
      this.$emit("change", val);
    },
    name(val) {
      this.nameForm = val;
    }
  },
  methods: {
    saveForm() {
      this.isEditting = false;
      this.$emit("submit", name);
    },
    activeEditForm() {
      this.isEditting = true;
    },
    initData() {
      this.nameForm = this.name;
    },
    cancelEditForm() {
      this.isEditting = false;
      this.nameForm = this.nameDefault;
    },
    get,
  },
  created() {
    this.initData();
  },
};
</script>

<style lang="scss">
.crc__edit-icon {
  rect {
    fill: #f9f9f9;
  }
}
</style>
