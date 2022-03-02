<template>
  <div class="container">
    <breadcrumb />
    <div class="row">
      <div class="col-md-9">
        <DetailExamIntro class="mb-4" :data="exam" />
        <DetaiExamContent class="mb-4" />
        <CommentAndRateExam :exam_id="get(params, 'exam_id', '')" />
      </div>

      <div class="col-md-3">
        <ExamRightSide :exam="exam" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  initBreadcrumb,
  createPageTitle,
  initPageTitle,
  useEffect,
} from "~/utils/common";
import ExamRightSide from "~/components/page/elearning/exams/detail/ExamRightSide";
import DetailExamIntro from "~/components/page/elearning/exams/detail/DetailExamIntro";
import DetaiExamContent from "~/components/page/elearning/exams/detail/DetaiExamContent";
import CommentAndRateExam from "~/components/page/elearning/exams/detail/CommentAndRateExam";
import { get } from "lodash";
import { mapState } from "vuex";

export default {
  components: {
    ExamRightSide,
    DetailExamIntro,
    DetaiExamContent,
    CommentAndRateExam,
  },

  data() {
    return {
      params: {
        exam_id: get(this, "$route.query.id", ""),
      },
      paramTests: {
        parent_id: get(this, "$route.query.id", ""),
        parent: "EXAM",
        show_workings: true,
      },
    };
  },

  computed: {
    ...mapState("elearning/exam/exam", { exam: "exam", tests: "tests" }),
  },

  methods: {
    getExam() {
      this.$store.dispatch("elearning/exam/exam/getExam", this.params);
    },
    getTests() {
      this.$store.dispatch("elearning/exam/exam/getTests", this.paramTests);
    },
    get,
  },

  mounted() {
    useEffect(this, this.getExam.bind(this), ["params"]);
    useEffect(this, this.getTests.bind(this), ["paramTests"]);

    const breadcrumb = [
      {
        title: "Quản lý E-learning",
        to: "/elearning",
      },
      {
        title: "Kỳ thi",
        to: "/elearning/exam/detail",
      },
    ];
    initBreadcrumb(this, breadcrumb);
  },
};
</script>

<style></style>
