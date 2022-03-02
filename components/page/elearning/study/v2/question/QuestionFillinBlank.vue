<template>
  <div class="elearning-question-type">
    <div class="eqt__content-question">
      <div>
        <span>{{ currentExerciseQuestion.index }}</span>
      </div>
      <span>Điền từ vào các ô trống bên dưới:</span>
    </div>
    <div
      class="eqt__content-answer "
      v-html="questionHtml"
      @input="handleOnchange"
    >
      <!-- <div class="d-flex align-items-center">
        Con
        <app-input class="question-input" />
        chạy chậm hơn con
        <app-input class="question-input" />
      </div> -->

      <!-- <div class="d-flex mt-5">
        <button
          class="btn-answer"
          v-for="(item, index) in currentExerciseQuestion.short_answers"
          :key="index"
        >
          {{ item.content }}
        </button>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { get } from "lodash";

export default {
  props: {
    questionChange: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      answer: null
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", [
      "currentExerciseQuestion",
      "currentExerciseAnswers"
    ]),

    questionHtml() {
      const count =
        this.currentExerciseQuestion.manual.content.split("[]").length - 1;
      let str = this.currentExerciseQuestion.manual.content;
      let position = 1;
      while (position <= count) {
        str = str.replace(
          "[]",
          `<input class="question-input question-input__md" id="${position}" />`
        );
        position++;
      }
      console.log("[questionHtml]", str);
      return str;
    }
  },
  methods: {
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseSubmission"
    ]),

    setAnswered() {
      // set current answered you checked
      console.log(
        "[setAnswered]",
        this.currentExerciseAnswers,
        this.currentExerciseQuestion
      );
      const answered = this.currentExerciseAnswers.find(
        an => an.question_id == this.currentExerciseQuestion.id
      );
      if (answered && answered.submissions && answered.submissions.length > 0) {
        for (var i = 0; i < answered.submissions.length; i++) {
          const s = answered.submissions[i];
          this.domSetElementValue(s.position, s);
        }
      } else {
        this.answer = null;
      }
    },

    handleOnchange(evt) {
      console.log("[handleOnchange]", evt.target.value);
      const position = evt.target.id;
      // setSubmission here
      const changeedEle = document.getElementById(position);
      if (!changeedEle) return;
      const answer = evt.target.value;
      // console.log("[submit]", position, answer);

      const answers = [
        {
          question_id: this.currentExerciseQuestion.id,
          position: +position,
          answer: answer,
          type: this.currentExerciseQuestion.type
        }
      ];
      // console.log("[handleOnchange] submission", answers);
      this.setStudyExerciseSubmission({ answers });
    },

    domSetElementValue(id, item) {
      // console.log("[domSetElementValue]", id, item.content);
      setTimeout(() => {
        const ele = document.getElementById(id);
        if (!!ele) {
          ele.value = item.answer;
        }
      }, 30);
    }
  },

  // mounted() {
  //   console.log("[questionChange] mounted", this.questionChange);
  //   if (this.questionChange) {
  //     this.setAnswered();
  //   }
  // },
  watch: {
    questionChange: {
      immediate: true,
      handler(_newVal, _oldVal) {
        console.log("[questionChange] watch fill_blank", _newVal);
        this.setAnswered();
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-question.scss";
.question-input__md {
  height: 3.5rem;
  padding: 0 .5rem;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>
