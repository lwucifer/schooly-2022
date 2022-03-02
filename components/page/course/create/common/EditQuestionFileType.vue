<template>
  <div class="px-4 py-4">
    <div>
      <div>
        <app-button
          v-if="get(editingItem, 'category', '') == 'CHOICE'"
          @click="handleSelectChoiceQuestion"
        >Chọn loại câu hỏi</app-button>
      </div>
      <div v-if="get(editingItem, 'category', '') == 'CHOICE'">
        <edit-question-yes-no
          v-if="choiceType == EXAM_TYPE_QUESTION['YES_NO']"
          @cancel="cancelEditQuestion"
          @submit="saveQuestion"
          :editingItem="editingItemClone"
        ></edit-question-yes-no>
        <edit-question-single-choice
          v-else-if="choiceType == EXAM_TYPE_QUESTION['SINGLE_CHOICE']"
          @cancel="cancelEditQuestion"
          @submit="saveQuestion"
          :editingItem="editingItemClone"
        ></edit-question-single-choice>
        <edit-question-multi-choice
          v-else-if="choiceType == EXAM_TYPE_QUESTION['MULTIPLE_CHOICE']"
          @cancel="cancelEditQuestion"
          @submit="saveQuestion"
          :editingItem="editingItemClone"
        ></edit-question-multi-choice>
        <edit-question-fill-blank
          v-else-if="choiceType == EXAM_TYPE_QUESTION['FILL_IN_BLANK']"
          @cancel="cancelEditQuestion"
          @submit="saveQuestion"
          :editingItem="editingItemClone"
        ></edit-question-fill-blank>
        <!-- <edit-question-writing
          v-else-if="choiceType == EXAM_TYPE_QUESTION['ESSAY']"
          @cancel="cancelEditQuestion"
          @submit="saveQuestion"
          :editingItem="editingItem"
        ></edit-question-writing>-->
        <edit-question-word-choice
          v-else-if="choiceType == EXAM_TYPE_QUESTION['WORD_CHOICE']"
          @cancel="cancelEditQuestion"
          @submit="saveQuestion"
          :editingItem="editingItemClone"
        ></edit-question-word-choice>
        <edit-question-match-word
          v-else-if="choiceType == EXAM_TYPE_QUESTION['WORD_MATCH']"
          @cancel="cancelEditQuestion"
          @submit="saveQuestion"
          :editingItem="editingItemClone"
        ></edit-question-match-word>
      </div>

      <div v-if="get(editingItem, 'category', '') == 'ESSAY'">
        <edit-question-writing
          @cancel="cancelEditQuestion"
          @submit="saveQuestion"
          :editingItem="editingItemClone"
        ></edit-question-writing>
      </div>

      <select-question-type-modal
        v-if="isShowSelectTypeModal"
        @click-close="isShowSelectTypeModal = false"
        @change="changeQuestionType"
      />
    </div>
  </div>
</template>
<script>
import SelectQuestionTypeModal from "~/components/page/course/create/common/SelectQuestionTypeModal";
import EditQuestionFrame from "~/components/page/course/create/common/EditQuestionFrame";

import EditQuestionYesNo from "~/components/page/course/create/common/EditQuestionYesNo";
import EditQuestionSingleChoice from "~/components/page/course/create/common/EditQuestionSingleChoice";
import EditQuestionMultiChoice from "~/components/page/course/create/common/EditQuestionMultiChoice";
import EditQuestionFillBlank from "~/components/page/course/create/common/EditQuestionFillBlank";
import EditQuestionWordChoice from "~/components/page/course/create/common/EditQuestionWordChoice";
import EditQuestionMatchWord from "~/components/page/course/create/common/EditQuestionMatchWord";
import EditQuestionWriting from "~/components/page/course/create/common/EditQuestionWriting";
import { EXAM_TYPE_QUESTION } from "~/utils/constants";
import { get, cloneDeep } from "lodash";

export default {
  components: {
    EditQuestionFrame,
    SelectQuestionTypeModal,
    EditQuestionYesNo,
    EditQuestionSingleChoice,
    EditQuestionMultiChoice,
    EditQuestionFillBlank,
    EditQuestionWordChoice,
    EditQuestionMatchWord,
    EditQuestionWriting,
  },
  props: {
    editingItem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
      isShowSelectTypeModal: false,
      choiceType: "",
      editingItemClone: cloneDeep(this.editingItem),
      answersData: [
        {
          question_id: this.editingItem.id,
          index: 0,
          name: "Đúng",
          content: "Đúng",
          selected: false,
        },
        {
          question_id: this.editingItem.id,
          index: 1,
          name: "Sai",
          content: "Sai",
          selected: false,
        },
      ],
      manual: {
        content: "",
        level: "EASY",
        note: "",
      },
    };
  },
  methods: {
    handleSelectChoiceQuestion() {
      this.isShowSelectTypeModal = true;
    },
    changeQuestionType(type) {
      this.editingItemClone.answers = [];
      console.log("changeQuestionType ", type);
      this.editingItemClone.type = type;
      this.editingItemClone.manual.level = "EASY";
      if (type == "YES_NO") {
        this.editingItemClone.answers = this.answersData;
        // this.editingItemClone.manual.level = this.manual;
      }
      this.choiceType = type;
      this.isShowSelectTypeModal = false;
    },
    cancelEdit() {
      this.$emit("cancel");
      console.log("[Cancel edit]");
    },
    saveQuestion(data) {
      console.log("save Question ", data);
      this.$emit("submit", data);
    },
    cancelEditQuestion() {
      this.choiceType = "";
      this.editingItemClone.manual.level = "BY_FILE";
      this.editingItemClone.answers = [];
    },
    submitForm() {
      // this.handleFormatPayload();
      // this.questionDetail.question_id = this.questionDetail.id;
      // this.$emit("submit", this.questionDetail);
      // console.log("[Submit form]");
    },
    get,
  },
};
</script>