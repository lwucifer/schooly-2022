<template>
  <div class="container course-create">
    <breadcrumb />

    <CreateStep class="mb-4" @step="val => currentStep = val" :currentStepActive="currentStep" />

    <CreateGeneralInfomation v-if="currentStep == 0" @nextStep="nextStep" />

    <CreateLearningContent v-if="currentStep == 1" />
  </div>
</template>

<script>
import CreateStep from "~/components/page/course/create/CreateStep";
import CreateGeneralInfomation from "~/components/page/course/create/new-ui/CreateGeneralInfomation";
import CreateLearningContent from "~/components/page/course/create/new-ui/CreateLearningContent";
import { initBreadcrumb } from "~/utils/common";
import { get } from "lodash";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  layout: "manage",

  components: {
    CreateStep,
    CreateGeneralInfomation,
    CreateLearningContent,
  },

  data() {
    return {
      currentStep: 0,
    };
  },

  created() {
    this.getGrades();
    this.getSubjects();
    this.getGroupClass();
    const elearningId =
      this.$route.query && this.$route.query.elearning_id
        ? this.$route.query.elearning_id
        : null;
    if (elearningId) {
      this.handleGetElearningDetail();
    } else {
      this.setElearningDetail({});
    }
    this.setBreadcrumb();
    // this.$store.dispatch("elearning/study-group/group/getListGroupClass");
  },

  computed: {
    ...mapState("auth", {
      userLogin: "token",
    }),
    ...mapState("elearning/create", {
      elearningDetail: "elearningDetail",
    }),
    isCreating() {
      return this.$route.query && this.$route.query.elearning_id ? false : true;
    },
  },

  methods: {
    ...mapActions("elearning", ["teacherClassGroupList"]),
    ...mapActions("elearning/create", ["getElearningDetail"]),
    ...mapMutations("elearning/create", ["setElearningDetail"]),
    handleGetElearningDetail() {
      const params = {
        elearning_id: this.$route.query.elearning_id
          ? this.$route.query.elearning_id
          : null,
      };
      this.getElearningDetail(params);
    },
    getGrades() {
      const params = {
        school_id: get(this, "userLogin.organization.id", ""),
        school_level: get(this, "userLogin.organization.level", ""),
      };
      this.$store.dispatch(`elearning/create/getGrades`, params);
    },

    getSubjects() {
      const params = {
        school_id: get(this, "userLogin.organization.id", ""),
      };
      this.$store.dispatch(`elearning/create/getSubjects`, params);
    },

    getGroupClass() {
      const params = {
        type: null,
        schoolyear_id: null,
      };
      this.teacherClassGroupList({ params: params });
    },
    nextStep() {
      this.currentStep = 1;
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
      // initPageTitle(this, createPageTitle("Tạo mới bài giảng và khóa học"));
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/_course-create.scss";
</style>
