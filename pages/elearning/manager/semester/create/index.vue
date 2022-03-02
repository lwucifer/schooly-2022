<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <ExamsCreateSide
          @click-item="changeForm"
          @publish="handlePublish"
          :active="done"
          :current="formActive"
        />
      </div>
      <div class="col-md-9">
        <ExamsCreateGeneral
          v-if="formActive == 'general'"
          @go-setting="goSetting"
        />
        <ExamsCreateSetting
          v-if="formActive == 'setting'"
          @go-exam="goExam"
          @go-back="formActive = 'general'"
        />
        <ExamsCreateExam
          v-if="formActive == 'exam'"
          @go-publish="goPublish"
          :edit="editTest"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ExamsCreateSide from "~/components/page/elearning/exams/create/ExamsCreateSide";
import ExamsCreateGeneral from "~/components/page/elearning/exams/create/ExamsCreateGeneral";
import ExamsCreateSetting from "~/components/page/elearning/exams/create/ExamsCreateSetting";
import ExamsCreateExam from "~/components/page/elearning/exams/create/ExamsCreateExam";

import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { RESPONSE_SUCCESS } from "~/utils/config";
import { mapGetters, mapActions, mapState } from "vuex";
import { getParamQuery, useEffect } from "~/utils/common";

const STORE_NAME_PUBLIC_GRADES = `elearning/public/public-grades`;

export default {
  components: {
    ExamsCreateSide,
    ExamsCreateGeneral,
    ExamsCreateSetting,
    ExamsCreateExam
  },
  data() {
    return {
      formActive: "general",
      examId: get(this.$route, "query.test_id", ""),
      loading: false,
      editTest: false,
      done: {
        general: false,
        setting: false,
        exam: false
      }
    };
  },

  async fetch({ query, store }) {
    const schoolId = store.getters["auth/organizationId"];
    const schoolLevel = store.getters["auth/organizationLevel"];
    const queryGrades = {
      school_id: schoolId ? schoolId : null,
      school_level: schoolLevel ? schoolLevel : null
    };
    const params = {
      school_id: schoolId
    };

    store.dispatch("elearning/public/public-grades/getClasses", params);

    await Promise.all([
      // store.dispatch(
      //   `elearning/public/public-subject/${actionTypes.ELEARNING.SUBJECT}`
      // ),
      store.dispatch(
        `${STORE_NAME_PUBLIC_GRADES}/${actionTypes.PUBLIC_GRADES.GRADES_ALL}`,
        {
          params: queryGrades
        }
      )
    ]);
  },

  methods: {
    ...mapActions("elearning/semester/manage-exam", [
      "publishStudyExam",
      "getDetailSemesterExam"
    ]),

    changeForm(val) {
      this.formActive = val;
    },

    goSetting(e) {
      this.examId = e;
      this.done.general = true;
      this.formActive = "setting";
      this.$router.push("?id=" + this.examId);
    },
    goExam() {
      this.done.setting = true;
      this.formActive = "exam";
    },
    goPublish() {
      this.done.exam = true;
    },

    async handlePublish() {
      const checkQuery =
        get(this.$route, "query.id", false) &&
        get(this.$route, "query.test_id", false);

      if (this.done.exam || checkQuery) {
        this.loading = true;

        const result = await this.publishStudyExam({
          exam_id: get(this.$route, "query.id", "")
        });
        if (get(result, 'data.success', false) == RESPONSE_SUCCESS) {
          this.$toasted.success("Đăng ký kỳ thi thành công");
        } else {
          this.$toasted.error(get(result, 'data.message', 'Đăng ký kỳ thi thất bại'));
        }

        this.loading = false;
      }
    },

    get
  },

  created() {
    if (get(this.$route, "query.id", false)) {
      this.formActive = "setting";
      this.done.general = true;
      this.done.setting = true;
    }
    if (get(this.$route, "query.test_id", false)) {
      this.formActive = "exam";
      this.done.setting = true;
      this.done.exam = true;
      this.editTest = true;
    }
  }
};
</script>

<style></style>
