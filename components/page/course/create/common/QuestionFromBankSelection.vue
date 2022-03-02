<template>
  <div class="edq_section">
    <div class="edq__from-bank-selection">
      <div class="row">
        <div class="col-md-4">
          <h5 class="edq__section-title">Ngân hàng câu hỏi</h5>
          <div>
            <p>{{dataRandom.question_bank_name}}</p>
            <p class="body-3 text-gray-3">{{dataRandom.question}} câu hỏi</p>
          </div>
        </div>
        <div class="col-md-8">
          <h5 class="edq__section-title">Chọn số câu hỏi</h5>
          <div>
            <app-input
              type="number"
              size="sm"
              :max="dataRandom.question"
              class="d-inline-block mb-0"
              style="max-width: 7rem;"
              :value="dataRandom.random"
              @input="changeQuestionNum"
            ></app-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { get, cloneDeep } from "lodash";
export default {
  components: {},
  props: {
    randomData: {},
  },
  data() {
    return {
      dataRandom: cloneDeep(this.randomData),
    };
  },
  methods: {
    cloneData() {},
    changeQuestionNum(val) {
      this.$emit("changeQuestionNum", val);
    },
  },
  created() {
    this.cloneData();
  },
};
</script>
<style lang="scss" scoped>
</style>