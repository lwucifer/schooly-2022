<template>
  <VclFacebook v-if="loading"></VclFacebook>
  <div class="container course-create" v-else>
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <CreateAside @click-item="setFormActive" :formActive="formActive" />
      </div>

      <div class="col-md-9">
        <EditExam
          :dataTest="getObjBankExamEdit"
          @goBack="goBack"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CreateAside from "~/components/page/course/create/CreateAside";
import EditExam from "~/components/page/course/create/exams/EditExam";
import * as actionTypes from "~/utils/action-types";
import {
  getParamQuery,
  useEffect,
  initBreadcrumb,
  createPageTitle,
  initPageTitle,
} from "~/utils/common";
import { mapState } from "vuex";
import { VclFacebook } from "vue-content-loading";
import { get } from "lodash";
import { CATEGORY_TEST } from "~/utils/constants";
const STORE_NAME_CREATING_EXCERCISES = "elearning/creating/creating-excercises";
const EXAM_STORE = `elearning/manager/bank/exam`;
export default {
  layout: "manage",

  components: {
    CreateAside,
    VclFacebook,
    EditExam,
  },

  async fetch({ params, query, store }) {
    const dataParams = {
      page: 1,
      size: 999,
      parent_id: query.exam_id,
      parent: "test",
    };
    await Promise.all([
      store.dispatch(
        `${EXAM_STORE}/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`,
        query.exam_id
      ),
      store.dispatch(
        `${EXAM_STORE}/${actionTypes.BANK_EXAM.DETAIL_EXAM}`,
        dataParams
      ),
    ]);
  },

  data() {
    return {
      formActive: "general",
      loading: true,
      redirect: true,
      dataTest: {},
    };
  },

  mounted() {
    useEffect(this, this.handleGetData.bind(this), [""]);

    // useEffect(this, this.handleUpdateProgress.bind(this), [
    //   "general",
    //   "lessons_lecture",
    //   "chapters",
    //   "setting",
    //   "lessons",
    //   "exams",
    //   "lesson",
    // ]);

    useEffect(this, this.getGrades.bind(this), ["userLogin"]);
    // useEffect(this, this.getSubjects.bind(this), ["userLogin"]);
  },

  beforeMount() {
    window.addEventListener("beforeunload", this.preventNav);
  },

  beforeDestroy() {
    window.removeEventListener("beforeunload", this.preventNav);
  },

  watch: {
    disabled_all: {
      handler: function () {
        if (this.disabled_all && this.redirect) {
          this.formActive = "settings";
          this.redirect = false;
        }
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      progress: "progress",
      lessons_lecture: "lessons_lecture",
      chapters: "chapters",
      setting: "setting",
      lessons: "lessons",
      exams: "exams",
      lesson: "lesson",
    }),
    ...mapState(EXAM_STORE, ["getObjBankExamEdit"]),
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
    isCreating() {
      return !this.general;
    },
    ...mapState(EXAM_STORE, ["getListBankExam"]),
  },

  methods: {
    handleChangeContent() {
      if (!this.loading) {
        this.$store.dispatch("elearning/create/getLessons");
      }
    },

    getGrades() {
      const params = {
        school_id: get(this, "userLogin.organization.id", ""),
        school_level: get(this, "userLogin.organization.level", ""),
      };
      this.$store.dispatch(`elearning/create/getGrades`, params);
    },

    async handleGetData() {
      this.loading = true;
      this.$store.dispatch("elearning/create/reset");
      const elearning_id = getParamQuery("elearning_id");
      const options = {
        params: {
          elearning_id,
        },
      };
      await this.$store.dispatch(`elearning/create/getGeneral`, options);
      await Promise.all([
        this.$store.dispatch(`elearning/create/getContent`),
        this.$store.dispatch("elearning/create/getLessons"),
        this.$store.dispatch(`elearning/create/getSetting`),
        this.$store.dispatch("elearning/create/getExams"),
      ]);
      await this.$store.dispatch("elearning/create/getProgress");
      this.setBreadcrumb();
      this.loading = false;
    },

    preventNav(event) {
      event.preventDefault();
      event.returnValue = "";
    },

    async setFormActive(key) {
      this.formActive = key;
      if (this.formActive == "exercise") {
        await this.$store.dispatch(
          `${STORE_NAME_CREATING_EXCERCISES}/${actionTypes.ELEARNING_CREATING_EXERCISES.LIST}`,
          {
            elearning_id: getParamQuery("elearning_id"),
          }
        );
      }
      if (this.formActive == "exam") {
        await this.$store.dispatch(
          `${EXAM_STORE}/${actionTypes.BANK_EXAM.LIST}`,
          {
            category: CATEGORY_TEST.TEST,
            parent: "ELEARNING",
            parent_id: getParamQuery("elearning_id"),
          }
        );
      }
    },
    goBack() {
      this.$router.push("/elearning/manager/exams")
    },
    setBreadcrumb() {
      const breadcrumb = [
        {
          title: "E-learning",
          to: "/elearning",
        },
        {
          title: "Bài giảng và khóa học",
          to: "/elearning/manager/courses",
        },
        {
          title: this.isCreating ? "Tạo mới" : "Chỉnh sửa",
          to: "",
        },
      ];
      initBreadcrumb(this, breadcrumb);
      initPageTitle(this, createPageTitle("Tạo mới bài giảng và khóa học"));
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_create-exercise.scss";
@import "~/assets/scss/components/course/_course-create.scss";
</style>
