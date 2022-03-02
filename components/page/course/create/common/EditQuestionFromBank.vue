<template>
  <edit-question-frame @cancel="cancelEdit" @submit="submitForm">
    <div>
      <div class="row">
        <div class="col-md-4">
          <question-type-viewer class="mb-5" :type="EXAM_TYPE_QUESTION[questionDetail.type]"></question-type-viewer>
        </div>
        <div class="col-md-8">
          <!-- <question-level-selection
            class="mb-5"
            :level="questionDetail.random.level || 'EASY'"
            @change="changeLevel"
          ></question-level-selection> -->
          <!-- <app-error :error="'something wrong'" /> -->
        </div>
        <div class="col-12">
          <question-from-bank-selection
            :randomData="questionDetail.random"
            @changeQuestionNum="changeQuestionNum"
          ></question-from-bank-selection>
        </div>
      </div>
    </div>
  </edit-question-frame>
</template>
<script>
import EditQuestionFrame from "~/components/page/course/create/common/EditQuestionFrame";
import QuestionTypeViewer from "~/components/page/course/create/common/QuestionTypeViewer";
import QuestionLevelSelection from "~/components/page/course/create/common/QuestionLevelSelection";
import QuestionFromBankSelection from "~/components/page/course/create/common/QuestionFromBankSelection";
import { EXAM_TYPE_QUESTION, EXAM_LEVEL } from "~/utils/constants";
import { get, cloneDeep } from "lodash";

const QUESTION_FAKE = {
  id: 7,
  level: "EASY",
  type: "FILL_IN_BLANK",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry multiple choice",
  note: "Note content",
  answers: "",
  source: "BANK",
};

export default {
  components: {
    EditQuestionFrame,
    QuestionTypeViewer,
    QuestionLevelSelection,
    QuestionFromBankSelection,
  },
  props: {
    editingItem: {},
  },
  data() {
    return {
      EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
      EXAM_LEVEL: Object.freeze(EXAM_LEVEL),
      questionDetail: cloneDeep(this.editingItem),
    };
  },
  methods: {
    // changeLevel(val) {
    //   console.log("[Change Level]", val);
    //   this.questionDetail.random.level = val;
    // },
    changeQuestionNum(val) {
      console.log("[Change question number]", val);
      this.questionDetail.random.random = val;
    },
    cancelEdit() {
      this.$emit("cancel");
      console.log("[Cancel edit]");
    },
    submitForm() {
      const data = {
        test_id: this.questionDetail.parent_id,
        random: {
          question_bank_id: this.questionDetail.random.question_bank_id,
          settings: [
            {
              level: this.questionDetail.random.level,
              random: this.questionDetail.random.random,
            },
          ],
        },
        random_id: this.questionDetail.id,
        method: "RANDOM",
      };
      this.$emit("submit", data);
      console.log("[Submit form]");
    },
  },
};
</script>
<style lang="scss" scoped>
</style>