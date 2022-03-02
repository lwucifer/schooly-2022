<template>
  <div>
    <ul class="elearning-home-box__tab bg-white px-4 pt-4">
      <li>
        <a href="" @click.prevent="tab = 1" :class="{ active: tab == 1 }"
          >BÌNH LUẬN</a
        >
      </li>

      <li>
        <a href="" @click.prevent="tab = 2" :class="{ active: tab == 2 }"
          >ĐÁNH GIÁ</a
        >
      </li>
    </ul>

    <TabQAExam v-if="tab == 1" class="bg-white px-4 py-4" :exam_id="exam_id" />
    <ExamReview v-if="tab == 2" :exam_id="exam_id" />
  </div>
</template>

<script>
import TabQAExam from "~/components/page/elearning/exams/detail/TabQAExam";
import ExamReview from "~/components/page/elearning/exams/detail/ExamReview";

export default {
  components: {
    ExamReview,
    TabQAExam,
  },

  props: {
    exam_id: {},
  },

  data() {
    return {
      tab: 1,
    };
  },
};
</script>
