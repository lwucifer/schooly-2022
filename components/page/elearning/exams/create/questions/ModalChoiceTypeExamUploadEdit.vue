<template>
  <app-modal
    :width="650"
    :component-class="{ 'modal-create-bank create-question onTop': true }"
    :footer="false"
    title="Chọn loai câu hỏi"
    @close="$emit('click-close')"
  >
    <div slot="content" class="content">
      <div class="row mt-3">
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = 1"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[0]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion1 />
            <p>{{ questionBankTypeArr[0]["name"] }}</p>
          </div>
        </div>
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = 2"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[1]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion2 />
            <p>{{ questionBankTypeArr[1]["name"] }}</p>
          </div>
        </div>
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = 3"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[2]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion3 />
            <p>{{ questionBankTypeArr[2]["name"] }}</p>
          </div>
        </div>
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = 5"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[3]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion6 />
            <p>{{ questionBankTypeArr[3]["name"] }}</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = 6"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[4]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion5 />
            <p>{{ questionBankTypeArr[4]["name"] }}</p>
          </div>
        </div>
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = 4"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[5]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion4 />
            <p>{{ questionBankTypeArr[5]["name"] }}</p>
          </div>
        </div>
      </div>

      <div class="buttons">
        <app-button color="white" class="mr-3" @click="$emit('click-close')"
          >Hủy</app-button
        >
        <app-button @click="handleAddTypeQuestionExam" :disabled="!submit"
          >Xác nhận</app-button
        >
      </div>
    </div>
  </app-modal>
</template>

<script>
import IconQuestion1 from "~/assets/svg/images/question1.svg?inline";
import IconQuestion2 from "~/assets/svg/images/question2.svg?inline";
import IconQuestion3 from "~/assets/svg/images/question3.svg?inline";
import IconQuestion4 from "~/assets/svg/images/question4.svg?inline";
import IconQuestion5 from "~/assets/svg/images/question5.svg?inline";
import IconQuestion6 from "~/assets/svg/images/question6.svg?inline";
import { get } from "lodash";
import { mapState } from "vuex";
import { questionBankTypeArr } from "~/utils/common";

export default {
  components: {
    IconQuestion1,
    IconQuestion2,
    IconQuestion3,
    IconQuestion4,
    IconQuestion5,
    IconQuestion6,
  },

  data() {
    return {
      questionBankTypeArr,
      submit: true,
      payloadAddQuestionBank: {
        type: "ESSAY", // ESSAY, SINGLE_CHOICE, MULTIPLE_CHOICE, WORD_CHOICE, YES_NO, FILL_IN_BLANK, WORD_MATCH
      },
    };
  },

  methods: {
    async handleAddTypeQuestionExam() {
      this.submit = false;
      this.$emit('handleAddTypeQuestionExam', this.payloadAddQuestionBank)
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_create-question-modal.scss";
</style>
