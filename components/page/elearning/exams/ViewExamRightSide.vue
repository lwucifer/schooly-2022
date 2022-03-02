<template>
  <div class="exam-right-side">
    <h4 class="exam-right-side__title">Nội dung kỳ thi</h4>

    <div class="exam-right-side__content">
      <ul>
        <li v-for="(test, index) in get(tests, 'content', [])" :key="test.id">
          <h5 :class="classTestName(test)">
            {{ index + 1 }}. {{ get(test, "name", "") }}
          </h5>

          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span :class="`${classTestName(test)} mr-3`">
                <IconTimer class="icon mr-2 vertical-middle" />
                {{ get(test, "duration", "") }}
              </span>

              <span :class="classTestName(test)">
                <IconFormatList class="icon mr-2 vertical-middle" />
                {{ get(test, "questions", 0) }} câu hỏi
              </span>
            </div>
            <p><IconCheckPrimary class="fill-primary" /></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import IconTimer from "~/assets/svg/v2-icons/timer_24px-1.svg?inline";
import IconFormatList from "~/assets/svg/v2-icons/format_list_bulleted_24px.svg?inline";
import IconCheckPrimary from "~/assets/svg/v2-icons/check_primary.svg?inline";
import IconLoop from "~/assets/svg/v2-icons/loop_24px.svg?inline";
import { get } from "lodash";
import { useEffect } from "~/utils/common";
import { mapState } from "vuex";

export default {
  components: {
    IconTimer,
    IconFormatList,
    IconCheckPrimary,
    IconLoop,
  },

  props: {
    test: {},
  },

  computed: {
    ...mapState("elearning/exam/test", { tests: "tests" }),
  },

  mounted() {
    useEffect(this, this.getTests.bind(this), ["params"]);
    useEffect(this, this.handleChangeTest.bind(this), ["test"]);
  },

  data() {
    return {
      params: {
        parent_id: "",
      },
    };
  },

  methods: {
    get,

    classTestName(test) {
      return get(test, "result.status", "") == "PASSED"
        ? "text-primary"
        : "" || get(test, "result.status", "") == "PENDING"
        ? "text-warning"
        : "" || get(test, "result.status", "") == "NONE"
        ? "text-dark"
        : "";
    },

    handleChangeTest() {
      this.params.parent_id = get(this, "test.parent_id", "");
    },

    getTests() {
      this.$store.dispatch("elearning/exam/test/getTests", this.params);
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/exams/_view-exam-right-side.scss";
</style>
