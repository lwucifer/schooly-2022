<template>
  <div class="edq_section h-100">
    <h5 class="edq__section-title">Loại câu hỏi</h5>
    <div class="edq__type-viewer">
      <div class="edq__type-viewer-symbol">
        <IconChoiceWordQuestion v-if="type == EXAM_TYPE_QUESTION['WORD_CHOICE']"/>
        <IconEssayQuestion v-else-if="type == EXAM_TYPE_QUESTION['ESSAY']"/>
        <IconFillQuestion v-else-if="type == EXAM_TYPE_QUESTION['FILL_IN_BLANK']"/>
        <IconMatchingQuestion v-else-if="type == EXAM_TYPE_QUESTION['WORD_MATCH']"/>
        <IconMultiChoiceQuestion v-else-if="type == EXAM_TYPE_QUESTION['MULTI_CHOICE']"/>
        <IconOneChoiceQuestion v-else-if="type == EXAM_TYPE_QUESTION['SINGLE_CHOICE']"/>
        <IconYesNoQuestion v-else-if="type == EXAM_TYPE_QUESTION['YES_NO']"/>
        <!-- <IconFromBankQuestion v-else-if="type == EXAM_TYPE_QUESTION['WORD_CHOICE']"/> -->
        <!-- <IconHasMediaQuestion v-else-if="type == EXAM_TYPE_QUESTION['WORD_CHOICE']"/> -->
        <IconHasMediaQuestion v-else />
      </div>
      <div class="edq__type-viewer-title">
        <h5 class="font-weight-medium text-primary">{{ type | exType2TxtTypeQues }}</h5>
      </div>
    </div>
  </div>
</template>
<script>
import IconChoiceWordQuestion from "~/assets/images/create-course/question-type/choice-word.svg?inline";
import IconEssayQuestion from "~/assets/images/create-course/question-type/essay.svg?inline";
import IconFillQuestion from "~/assets/images/create-course/question-type/fill.svg?inline";
import IconFromBankQuestion from "~/assets/images/create-course/question-type/from-bank.svg?inline";
import IconHasMediaQuestion from "~/assets/images/create-course/question-type/has-media.svg?inline";
import IconMatchingQuestion from "~/assets/images/create-course/question-type/match.svg?inline";
import IconMultiChoiceQuestion from "~/assets/images/create-course/question-type/multiple-choice.svg?inline";
import IconOneChoiceQuestion from "~/assets/images/create-course/question-type/one-choice.svg?inline";
import IconYesNoQuestion from "~/assets/images/create-course/question-type/yes-no.svg?inline";
import { EXAM_TYPE_QUESTION } from "~/utils/constants";

export default {
  components: {
    IconChoiceWordQuestion,
    IconEssayQuestion,
    IconFillQuestion,
    IconFromBankQuestion,
    IconHasMediaQuestion,
    IconMatchingQuestion,
    IconMultiChoiceQuestion,
    IconOneChoiceQuestion,
    IconYesNoQuestion
  },
  props: {
    type: {
      type: String, // ESSAY | SINGLE_CHOICE | MULTI_CHOICE | WORD_CHOICE | WORD_MATCH | YES_NO | FILL_IN_BLANK
      required: true,
      validator: (value) => Object.values(EXAM_TYPE_QUESTION).includes(value) 
    }
  },
  data() {
    return {
      EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
    }
  }
}
</script>
<style lang="scss" scoped>

</style>