<template>
  <div class="cgi-form-group d-flex justify-content-start align-items-center">
    <h2 class="cgi-form-title heading-6 mr-4">Trình độ</h2>
    <app-select
      style="width: 60%"
      class="cc-select"
      :options="gradeOpt"
      placeholder="Chọn lớp"
      @change="handleChangeGrade"
      label="name"
      :value="grade && grade.id"
    >
      <template slot="placeholder-icon">
        <IconAngleDown class="icon" />
      </template>
    </app-select>
  </div>
</template>

<script>
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { mapState } from "vuex";
import { useEffect } from "~/utils/common";

export default {
  components: {
    IconAngleDown,
  },

  props: {
    defaultValue: {
      default: "",
    },
  },

  data() {
    return {
      grade: {},
    };
  },

  async mounted() {
    useEffect(this, this.handleChangeGrades.bind(this), [
      "defaultValue",
      "grades",
    ]);
  },

  computed: {
    ...mapState("elearning/create", {
      grades: "grades",
    }),

    gradeOpt() {
      return this.grades.map((item) => ({
        ...item,
        value: item.id,
        text: item.name,
      }));
    },
  },

  methods: {
    get,
    handleChangeGrade(level) {
      this.$emit("handleChangeGrade", level);
    },
    handleChangeGrades() {
      this.grade = this.grades.filter(
        (grade) => grade.id == this.defaultValue
      )[0];
    },
  },
};
</script>
