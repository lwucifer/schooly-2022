<template>
  <div class="elearning-question-type">
    <div class="eqt__content-question">
      <div>
        <span>{{ currentExerciseQuestion.index }}</span>
      </div>
      <span>Kéo từ thích hợp vào chỗ trống ở câu bên dưới:</span>
    </div>
    <div class="eqt__content-answer" @input="handleOnchange">
      <div class="d-flex align-items-center" v-html="questionHtml"></div>
    </div>
  </div>
</template>

<script>
// https://medium.com/swlh/how-to-add-drag-and-drop-to-your-vuejs-project-3fc36e7b766a

import { mapState, mapMutations } from "vuex";
import { get } from "lodash";
import draggable from "vuedraggable";

export default {
  props: {
    questionChange: {
      type: Number,
      default: 0
    }
  },

  components: {
    draggable
  },

  data() {
    return {
      // answer: null,
      selectedAnswer: null
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
        let options = ["<option>Chọn đáp án</option>"];
        this.currentExerciseQuestion.short_answers
          .filter(a => a.position == position)
          .map(m => {
            options.push(`<option value="${m.id}">${m.content}</option>`);
          });
        str = str.replace(
          "[]",
          // `<input class="question-input question-input__md" id="${position}" />`
          `<select class="question__select" id="${position}">
            ${options}
          </select>`
        );
        position++;
      }
      // console.log("[questionHtml]", str);
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
          const answerItem = this.currentExerciseQuestion.short_answers.find(
            c => c.id == s.selected_answer_id
          );
          if (answerItem) {
            this.domSetElementValue(s.position, answerItem);
          }
        }
      } else {
        // this.answer = null;
      }
    },

    handleOnchange(evt) {
      console.log("[handleOnchange]", evt.target.value);
      const position = evt.target.id;
      // setSubmission here
      const changeedEle = document.getElementById(position);
      if (!changeedEle) return;
      const answer = evt.target.value;

      const answers = [
        {
          question_id: this.currentExerciseQuestion.id,
          position: +position,
          selected_answer_id: answer,
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
          ele.value = item.id;
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
        console.log("[questionChange] watch Choice_Word", _newVal);
        this.setAnswered();
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-question.scss";
.question__select {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 3px;
  height: 3.5rem;
}
</style>
