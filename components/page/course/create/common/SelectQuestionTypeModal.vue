<template>
  <app-modal
    :width="650"
    :component-class="{ 'modal-create-bank create-question onTop': true }"
    :footer="false"
    title="Chọn loại câu hỏi"
    @close="$emit('click-close')"
  >
    <div slot="content" class="content">
      <label class="label">Loại câu hỏi</label>
      <div class="row mt-3">
        <div
          class="col-4"
          v-for="(item, index) in questionBankTypeArr"
          :key="index"
        >
          <div
            :class="
              payloadAddQuestionBank.type == item['id']
                ? 'active'
                : ''
            "
            @click="changeType(item)"
            >
            <IconQuestion1 />
            <p>{{ item["name"] }}</p>
          </div>
        </div>
      </div>

      <div class="buttons">
        <app-button color="white" class="mr-3" @click="$emit('click-close')"
          >Hủy</app-button
        >
        <app-button @click="submitForm" :disabled="!submit"
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
import IconQuestion7 from "~/assets/svg/images/question7.svg?inline";
import { get } from "lodash";
import { mapState } from "vuex";
import { questionBankType, questionBankTypeArr } from "~/utils/common";

export default {
  components: {
    IconQuestion1,
    IconQuestion2,
    IconQuestion3,
    IconQuestion4,
    IconQuestion5,
    IconQuestion6,
    IconQuestion7,
  },

  props: {
    visible: Boolean,
  },

  watch: {
    
  },

  computed: {
    
  },

  data() {
    return {
      questionBankType,
      submit: true,
      error: {
        name: "",
      },
      payloadAddQuestionBank: {
        type: "ESSAY", // ESSAY, SINGLE_CHOICE, MULTIPLE_CHOICE, WORD_CHOICE, YES_NO, FILL_IN_BLANK, WORD_MATCH
        name: "",
      },
      questionBankTypeArr: [
        {
          id: "YES_NO",
          name: "Đúng/Sai",
        },
        {
          id: "SINGLE_CHOICE",
          name: "Một lựa chọn",
        },
        {
          id: "MULTIPLE_CHOICE",
          name: "Nhiều lựa chọn",
        },
        {
          id: "FILL_IN_BLANK",
          name: "Điền từ",
        },
        {
          id: "WORD_CHOICE",
          name: "Chọn từ",
        },
        {
          id: "WORD_MATCH",
          name: "Ghép đáp án",
        },
      ]
    };
  },

  methods: {
    submitForm() {
      this.$emit("change", this.payloadAddQuestionBank.type);
    },
    changeType(item) {
      this.$emit("change", item.id)
    },
    get,
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_create-question-modal.scss";
</style>
