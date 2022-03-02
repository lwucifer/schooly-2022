<template>
  <div class="detail-exam-content bg-white px-4 py-4">
    <h4 class="mb-4">Nội dung kỳ thi</h4>
    <DetaiExamContentItem
      class="mb-4"
      v-for="test in get(tests, 'content', [])"
      :key="test.id"
      :test="test"
    />
    <!-- <DetaiExamContentItem propOutline /> -->
  </div>
</template>

<script>
import { get } from "lodash";
import { mapState } from "vuex";
import DetaiExamContentItem from "~/components/page/elearning/exams/detail/DetaiExamContentItem";

export default {
  components: {
    DetaiExamContentItem,
  },

  computed: {
    ...mapState("elearning/exam/exam", { tests: "tests" }),
  },

  methods: {
    get,
  },
};
</script>

<style lang="scss"></style>
