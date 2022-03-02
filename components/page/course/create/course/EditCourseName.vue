<template>
  <div class="d-flex align-items-center">
    <input
      v-if="isEditCourseName"
      v-model="courseNameModel"
      ref="inputCourseName"
      maxlength="150"
      class="cc-box__input-title bg-white mb-0"
      type="text"
    />
    <h2 v-else class="cc-box__title heading-5">
      <!-- Tiêu đề: {{ courseNameModel }}  -->
      {{
      courseNameModel.length > 60
      ? "Tiêu đề: " + courseNameModel.slice(0, 40) + "..."
      : "Tiêu đề: " + courseNameModel
      }}
    </h2>

    <button
      class="cc-box__btn cc-box__btn-edit-hover"
      @click="editCourseName"
      v-if="!isEditCourseName"
    >
      <IconEdit class="icon ml-2"  style="width: 18px"/>
    </button>

    <template v-if="isEditCourseName">
      <button
        class="cc-box__btn mr-4 text-success d-flex align-items-center w-50"
        @click="handleSaveCourseName"
      >
        <IconSave24px class="mr-2 fill-primary" />Lưu
      </button>
      <button
        class="cc-box__btn text-secondary d-flex align-items-center w-50"
        @click="cancelEditCourseName"
      >
        <IconClose class="mr-2 fill-secondary" />Huỷ
      </button>
    </template>
  </div>
</template>

<script>
const IconCheck = () => import("~/assets/svg/design-icons/check.svg?inline");
const IconEdit = () => import("~/assets/svg/v2-icons/edit.svg?inline");
const IconTimes = () => import("~/assets/svg/design-icons/times.svg?inline");
import IconClose from "~/assets/svg/icons/close.svg?inline";
import IconSave24px from "~/assets/svg/v2-icons/save_24px.svg?inline";

import { get } from "lodash";
import { createPayloadAddCourse } from "~/models/course/AddCourse";
import * as actionTypes from "~/utils/action-types";
import { mapState } from "vuex";
import { useEffect, getParamQuery } from "~/utils/common";

export default {
  components: {
    IconCheck,
    IconEdit,
    IconTimes,
    IconClose,
    IconSave24px
  },

  props: {
    defaultName: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      isEditCourseName: false,
      courseNameModel: get(this, "defaultName", "")
    };
  },

  watch: {
    defaultName: {
      handler: function() {
        this.courseNameModel = this.defaultName;
      },
      deep: true
    }
  },

  methods: {
    editCourseName() {
      this.isEditCourseName = true;
      const timeout = setTimeout(() => {
        this.$refs.inputCourseName.focus();
        clearTimeout(timeout);
      });
    },

    cancelEditCourseName() {
      this.isEditCourseName = false;
      this.courseNameModel = this.defaultName;
    },

    async handleSaveCourseName() {
      const data = {
        name: this.courseNameModel,
        elearning_id: getParamQuery("elearning_id")
      };
      const payload = createPayloadAddCourse(data);
      const result = await this.$store.dispatch(
        `elearning/creating/creating-general/${actionTypes.ELEARNING_CREATING_GENERAL.ADD}`,
        payload
      );

      if (get(result, "success", false)) {
        this.$toasted.success(get(result, "message", ""));
        this.isEditCourseName = false;
        const options = {
          params: {
            elearning_id: getParamQuery("elearning_id")
          }
        };
        await this.$store.dispatch(`elearning/create/getGeneral`, options);
        // this.$store.dispatch(
        //   `elearning/creating/creating-general/${actionTypes.ELEARNING_CREATING_GENERAL.LIST}`,
        //   options
        // );
        return;
      }
      this.$toasted.error(get(result, "message", ""));
    }
  }
};
</script>
