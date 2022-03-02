<template>
  <div class="">
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <ViewExamInfo class="mb-4" :test="test" />
          <CommentAndRateTest :test_id="get(test, 'id', '')" />
        </div>

        <div class="col-md-4">
          <ViewExamRightSide :test="test" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ViewExamInfo from "~/components/page/elearning/exams/ViewExamInfo";
import CommentAndRateTest from "~/components/page/elearning/exams/detail/CommentAndRateTest";
import ViewExamRightSide from "~/components/page/elearning/exams/ViewExamRightSide";
import { get } from "lodash";
import { mapState } from "vuex";
import {
  initBreadcrumb,
  createPageTitle,
  initPageTitle,
  useEffect,
} from "~/utils/common";

export default {
  components: {
    ViewExamInfo,
    CommentAndRateTest,
    ViewExamRightSide,
  },

  computed: {
    ...mapState("elearning/exam/test", { test: "test" }),
  },

  mounted() {
    useEffect(this, this.getTest.bind(this), ["$route.query.id"]);

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

  methods: {
    getTest() {
      const test_id = get(this, "$route.query.id", "");
      this.$store.dispatch("elearning/exam/test/getTest", test_id);
    },
    get,
  },
};
</script>
