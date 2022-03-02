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

    <TabQATest v-if="tab == 1" class="bg-white px-4 py-4" :test_id="test_id" />
    <TestReview v-if="tab == 2" :test_id="test_id" />
  </div>
</template>

<script>
import TabQATest from "~/components/page/elearning/exams/detail/TabQATest";
import TestReview from "~/components/page/elearning/exams/detail/TestReview";

export default {
  components: {
    TestReview,
    TabQATest,
  },

  props: {
    test_id: {},
  },

  data() {
    return {
      tab: 1,
    };
  },
};
</script>
