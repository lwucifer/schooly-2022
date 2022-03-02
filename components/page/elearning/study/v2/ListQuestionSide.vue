<template>
  <div class="list-question-side">
    <div class="list-question-side__content">
      <div class="number-question">
        <p
          v-for="(item, index) in questions"
          :key="index"
          :class="{
            'mr-0': item % 6 == 0, // right item, 3: not seen
            'bg-green': isAnswered(item) == 1, // answered item
            'bg-red': isAnswered(item) == 2, // not answer item
            'bg-blue': item.index == currentQuestionIndex // current item
          }"
          @click="setStudyExerciseQuestionChoose(item.index)"
        >
          {{ item.index }}
        </p>
      </div>

      <div class="status-question">
        <div class="title">Trạng thái</div>

        <p class="mb-3">
          <span><CycleGreen class="icon mr-2" /> Đã trả lời</span>
          <span><CycleBlue class="icon mr-2" /> Đang làm</span>
        </p>

        <p>
          <span><CycleRed class="icon mr-2" /> Chưa trả lời</span>
          <span><CycleGray class="icon mr-2" /> Chưa xem</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import CycleGreen from "~/assets/svg/v2-icons/cycle-green.svg?inline";
import CycleBlue from "~/assets/svg/v2-icons/cyle-blue.svg?inline";
import CycleRed from "~/assets/svg/v2-icons/cycle-red.svg?inline";
import CycleGray from "~/assets/svg/v2-icons/cycle-gray.svg?inline";

import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  components: {
    CycleGreen,
    CycleBlue,
    CycleRed,
    CycleGray
  },

  computed: {
    ...mapGetters("elearning/study/study-exercise", [
      "numOfQuestion",
      "currentQuestionIndex"
    ]),
    ...mapState("elearning/study/study-exercise", [
      "currentExerciseAnswers",
      "currentExerciseQuestion",
      "questions"
    ])
  },

  methods: {
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseQuestionNav",
      "setStudyExerciseQuestionChoose"
    ]),
    isAnswered(item) {
      const answeredItem = this.currentExerciseAnswers.find(
        a => a.question_id == item.id
      );
      // console.log("[answeredItem]", item, answeredItem);
      if (answeredItem) {
        const submissions = answeredItem.submissions;
        if (!submissions) return 3; // chua doc
        if (submissions.length < 1) return 2; // chua tra loi
        let seen = false;
        submissions.map(sub => {
          for (var p in sub) {
            if (!!p) seen = true;
          }
        });
        if (seen) return 1;
        else return 2;
      }else return 2;
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/exams/_list-question-side.scss";
</style>
