<template>
  <li class="e-exercise-list-questions__item">
    <div
      v-html="question.content"
      class="e-exercise-list-questions__question text-clickable"
      @click.prevent="navToQuestion"
    ></div>

    <div
      v-if="question.type === EXERCISE_TYPES.CHOICE && !isAnswer"
      class="e-exercise-list-questions__answer e-exercise-list-questions__answer--essay"
    >
      <a
        href
        class="e-exercise-list-questions__toggle-answer"
        :class="{ expand: expand }"
        @click.prevent="toggleExpand"
      >
        <template v-if="expand">Thu gọn</template>
        <template v-else>Xem đáp án</template>
        <IconAngleDown class="icon" />
      </a>

      <div v-if="expand" class="e-exercise-list-questions__answer-content">
        <p v-for="(item, index) in answers" :key="index" style="padding: 0.5rem 0;">
          {{ item.no | getQuestionNoText }}. {{ item.content }}
        </p>

        <p></p>
      </div>
    </div>

    <div
      v-if="question.type === EXERCISE_TYPES.CHOICE && isAnswer"
      class="e-exercise-list-questions__answer e-exercise-list-questions__answer--choice"
    >
      <span>
        <!-- IF USER'S ANSWER IS TRUE -->
        <span
          class="d-inline-flex align-items-center text-primary"
          v-if="question.isUserTrue"
        >
          Câu trả lời: {{ student_answer_index | getQuestionNoText }}.
          {{ student_answer_content }}
          <IconCheck class="icon fill-opacity-1 heading-3 ml-2" />
        </span>
        <!-- IF USER'S ANSWER IS TRUE -->

        <!-- IF USER'S ANSWER IS FALSE -->
        <span v-else style="display: flex;">
          <span class="d-inline-flex align-items-center text-secondary">
            Câu trả lời:
            {{ student_answer_index | getQuestionNoText }}.
            {{ student_answer_content }}
            <IconCancel class="icon fill-opacity-1 heading-3 ml-2" />
          </span>

          <span class="d-inline-flex align-items-center text-primary ml-4">
            Đáp án đúng:
            {{ correct_answer_index | getQuestionNoText }}.
            {{ correct_answer_content }}
          </span>
        </span>
        <!-- IF USER'S ANSWER IS FALSE -->
      </span>
    </div>
  </li>
</template>

<script>
import { EXERCISE_TYPES } from "~/utils/constants";
import { mapMutations } from "vuex";
const IconAngleDown = () =>
  import("~/assets/svg/design-icons/angle-down.svg?inline");
const IconCheck = () => import("~/assets/svg/v2-icons/check_24px.svg?inline");
const IconCancel = () => import("~/assets/svg/v2-icons/cancel_24px.svg?inline");

export default {
  components: {
    IconAngleDown,
    IconCheck,
    IconCancel
  },

  props: {
    question: {
      type: Object,
      default: () => {}
    },
    isAnswer: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      EXERCISE_TYPES: Object.freeze(EXERCISE_TYPES),
      expand: false
    };
  },

  methods: {
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseQuestionCurrent"
    ]),

    navToQuestion() {
      console.log("[navToQuestion]", this.question);
      this.setStudyExerciseQuestionCurrent(this.question.id);
    },

    toggleExpand() {
      this.expand = !this.expand;
    }
  },

  computed: {
    correct_answer_content() {
      return this.question.correct_answer
        ? this.question.correct_answer.content
        : "";
    },
    correct_answer_index() {
      return this.question.correct_answer
        ? this.question.correct_answer.index
        : "";
    },

    student_answer_content() {
      return this.question.student_answer
        ? this.question.student_answer.content
        : "";
    },
    student_answer_index() {
      return this.question.student_answer
        ? this.question.student_answer.index
        : "";
    },
    answers() {
      return !this.question.answers
        ? []
        : this.question.answers.map(q => {
            return {
              no: q.index,
              content: `${q.content}`
            };
          });
    }
  }
};
</script>
