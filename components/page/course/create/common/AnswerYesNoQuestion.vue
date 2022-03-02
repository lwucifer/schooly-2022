<template>
  <div class="edq_section">
    <div class="row">
      <div class="col-md-3">
        <h5 class="edq__section-title">Chọn đáp án đúng</h5>
      </div>
      <div class="col-md-9">
        <h5 class="edq__section-title">Nội dung đáp án</h5>
      </div>

      <template v-for="(item, index) in answers && answers.length > 0 ? answers : answersData">
        <div class="col-md-3" :key="'CHOICE_ALPHA' + index">
          <div class>
            <app-radio
              @click="$emit('changeAns', index)"
              :name="'QUESTION_CONTENT'"
              :checked="item.selected"
            >{{ CHOICE_ALPHA[index] }}</app-radio>
          </div>
        </div>

        <div class="col-md-9" :key="'CONTENT' + index">
          <div class="d-flex mb-4">
            <span>{{ index == 0 ? 'Đúng': 'Sai' }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
const CHOICE_ALPHA = ["A", "B", "C", "D", "E", "F", "G"];

export default {
  components: {},
  props: {
    answers: {
      type: Array | Object,
      default: () => [],
    },
    idQuestion: { type: String, default: "" },
  },
  data() {
    return {
      CHOICE_ALPHA: Object.freeze(CHOICE_ALPHA),
    };
  },
  methods: {
    cloneData() {},
  },
  created() {
    this.cloneData();
  },
};
</script>
<style lang="scss" scoped>
</style>