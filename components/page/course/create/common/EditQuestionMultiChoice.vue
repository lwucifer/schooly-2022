<template>
  <edit-question-frame @cancel="cancelEdit" @submit="submitForm">
    <div>
      <div class="row">
        <div class="col-md-4">
          <question-type-viewer :type="EXAM_TYPE_QUESTION['MULTIPLE_CHOICE']"></question-type-viewer>
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
            check-type="checkbox"
            @changeAns="changeCorrectAns"
            @changeContent="changeAnsContent"
            @deleteAns="deleteAns"
          ></answer-list>
        </div>
        <div class="col-12">
          <question-note-editor
            class="mb-1"
            :content="questionDetail && questionDetail.manual && questionDetail.manual.note"
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
    changeCorrectAns(index, value) {
      // index of true answer
      console.log("[Change correct answer]", index, value);
      if (this.questionDetail.answers[index] != undefined) {
        this.questionDetail.answers[index].selected = value;
      } else {
        const indexAlpha = this.questionDetail.answers.length;
        const item = {
          index: 0,
          selected: value,
          name: this.alphabet[indexAlpha],
          question_id: this.questionDetail.id,
        };
        this.questionDetail.answers.push(item);
      }
    },
    changeAnsContent(index, value) {
      console.log("[Change content of question]", index, value);
      if (this.questionDetail.answers[index] != undefined) {
        this.questionDetail.answers[index].content = value;
      } else {
        const indexAlpha = this.questionDetail.answers.length;
        const item = {
          content: value,
          index: 0,
          name: this.alphabet[indexAlpha],
          question_id: this.questionDetail.id,
          selected: false,
        };
        this.questionDetail.answers.push(item);
      }
    },
    deleteAns(index) {
      // this.questionDetail.answers.splice(index, 1);
      console.log("[Delete answer]", index);
      this.questionDetail.answers.splice(index, 1);
    },
    changeNote(val) {
      console.log("[Change note]", val);
      this.questionDetail.manual.note = val;
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
};
</script>
<style lang="scss" scoped>
</style>