<template>
  <edit-question-frame @cancel="cancelEdit" @submit="submitForm">
    <div>
      <div class="row">
        <div class="col-md-4">
          <question-type-viewer :type="EXAM_TYPE_QUESTION['SINGLE_CHOICE']"></question-type-viewer>
        </div>
        <div class="col-md-8">
          <!-- <question-level-selection
            v-if="questionDetail.method == 'MANUAL' || questionDetail.method == 'UPLOAD'"
            :level="questionDetail && questionDetail.manual && questionDetail.manual.level || 'EASSY'"
            @change="changeLevel"
          ></question-level-selection>
          <question-level-selection
            v-else-if="questionDetail.method == 'SELECT'"
            :level="questionDetail && questionDetail.select && questionDetail.select.level || 'EASSY'"
            @change="changeLevel"
          ></question-level-selection> -->
          <!-- <app-error :error="'something wrong'" /> -->
        </div>
        <div class="col-12">
          <question-content-editor
            v-if="questionDetail.method == 'MANUAL' || questionDetail.method == 'UPLOAD'"
            class="mt-3 mb-4"
            :content="questionDetail && questionDetail.manual && questionDetail.manual.content || ''"
            @change="changeContent"
          ></question-content-editor>
          <question-content-editor
            v-else-if="questionDetail.method == 'SELECT'"
            class="mt-3 mb-4"
            :content="questionDetail && questionDetail.select && questionDetail.select.content || ''"
            @change="changeContent"
          ></question-content-editor>
        </div>
        <div class="col-12">
          <answer-list
            :answers="questionDetail && questionDetail.answers"
            @changeAns="changeCorrectAns"
            @changeContent="changeAnsContent"
            @deleteAns="deleteAns"
          ></answer-list>
        </div>
        <div class="col-12">
          <question-note-editor
            class="mb-1"
            :content="questionDetail && questionDetail.note"
            @change="changeNote"
          ></question-note-editor>
        </div>
      </div>
    </div>
  </edit-question-frame>
</template>
<script>
import EditQuestionFrame from "~/components/page/course/create/common/EditQuestionFrame";
import QuestionTypeViewer from "~/components/page/course/create/common/QuestionTypeViewer";
import QuestionLevelSelection from "~/components/page/course/create/common/QuestionLevelSelection";
import QuestionContentEditor from "~/components/page/course/create/common/QuestionContentEditor";
import AnswerList from "~/components/page/course/create/common/AnswerHasChoicesQuestion";
import QuestionNoteEditor from "~/components/page/course/create/common/QuestionNoteEditor";
import { EXAM_TYPE_QUESTION, EXAM_LEVEL } from "~/utils/constants";
import { get, cloneDeep } from "lodash";
import { useEffect, questionBankTypeArr } from "~/utils/common";

const QUESTION_FAKE = {
  id: 6,
  level: "EASY",
  type: "SINGLE_CHOICE",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
  note: "Note content",
  answers: [
    {
      content: "Answer number 1",
      correct: false,
    },
    {
      content: "Answer number 2",
      correct: true,
    },
    {
      content: "Answer number 3",
      correct: false,
    },
  ],
};

export default {
  components: {
    EditQuestionFrame,
    QuestionTypeViewer,
    QuestionLevelSelection,
    QuestionContentEditor,
    AnswerList,
    QuestionNoteEditor,
  },
  props: {
    editingItem: {},
  },
  data() {
    return {
      EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
      EXAM_LEVEL: Object.freeze(EXAM_LEVEL),
      questionDetail: cloneDeep(this.editingItem),
      alphabet: [..."abcdefghijklmnopqrstuvwxyz"],
    };
  },
  methods: {
    // changeLevel(val) {
    //   console.log("[Change Level]", val);
    //   this.questionDetail.manual.level = val;
    // },
    changeContent(val) {
      console.log("[Change content]", val);
      this.questionDetail.manual.content = val;
    },
    changeCorrectAns(index) {
      // index of true answer
      console.log("[Change correct answer]", index);
      if (this.questionDetail.answers[index] != undefined) {
        this.questionDetail.answers[index].selected = true;
      } else {
        const indexAlpha = this.questionDetail.answers.length;
        const item = {
          index: indexAlpha,
          selected: true,
          name: this.alphabet[indexAlpha],
          question_id: this.questionDetail.id,
        };
        this.questionDetail.answers.push(item);
      }
      // this.questionDetail.answers.splice(index, 1);
    },
    changeAnsContent(index, val) {
      console.log("[Change Ans content]", index, val);
    },
    deleteAns(index) {
      console.log("[Change Ans content]", index);
      this.questionDetail.answers.splice(index, 1);
    },
    changeAnsContent(index, value) {
      console.log("[Change content of question]", index, value);
      if (this.questionDetail.answers[index] != undefined) {
        this.questionDetail.answers[index].content = value;
      } else {
        const indexAlpha =
          (this.questionDetail.answers && this.questionDetail.answers.length) ||
          0;
        const item = {
          content: value,
          index: indexAlpha,
          name: this.alphabet[indexAlpha],
          question_id: this.questionDetail.id,
          selected: false,
        };
        this.questionDetail.answers.push(item);
      }
    },
    changeNote(val) {
      console.log("[Change note]", val);
      this.questionDetail.manual.note = val;
    },
    deleteAns(index) {
      console.log("[Delete ans]", index);
    },
    cancelEdit() {
      this.$emit("cancel");
      console.log("[Cancel edit]");
    },
    submitForm() {
      this.handleFormatPayload();
      this.questionDetail.question_id = this.questionDetail.id;
      this.$emit("submit", this.questionDetail);
      console.log("[Submit form]");
    },
    handleFormatPayload() {
      if (this.questionDetail.type === questionBankTypeArr[3]["id"]) {
        this.questionDetail.answers = null;
      }
      if (this.questionDetail.type === questionBankTypeArr[4]["id"]) {
        this.questionDetail.answers = null;
      }
      if (this.questionDetail.type === questionBankTypeArr[6]["id"]) {
        this.questionDetail.answers = null;
      }
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
</style>