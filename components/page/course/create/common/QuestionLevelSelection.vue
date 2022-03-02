<template>
  <div class="edq_section h-100">
    <h5 class="edq__section-title">Chọn cấp độ cho câu hỏi</h5>
    <div class="edq__levels">
      <app-radio-group>
        <app-radio
          name="groupLevel"
          @change="changeValue(EXAM_LEVEL['EASY'])"
          :value="EXAM_LEVEL['EASY']"
          :checked="levelOpt == EXAM_LEVEL['EASY']"
          @click="levelOpt = EXAM_LEVEL['EASY']"
        >Dễ</app-radio>
        <app-radio
          name="groupLevel"
          @change="changeValue(EXAM_LEVEL['MEDIUM'])"
          :value="EXAM_LEVEL['MEDIUM']"
          :checked="levelOpt == EXAM_LEVEL['MEDIUM']"
          @click="levelOpt = EXAM_LEVEL['MEDIUM']"
        >Trung bình</app-radio>
        <app-radio
          name="groupLevel"
          @change="changeValue(EXAM_LEVEL['HARD'])"
          :value="EXAM_LEVEL['HARD']"
          :checked="levelOpt == EXAM_LEVEL['HARD']"
          @click="levelOpt = EXAM_LEVEL['HARD']"
        >Khó</app-radio>
      </app-radio-group>
    </div>
  </div>
</template>
<script>
import { EXAM_LEVEL } from "~/utils/constants";

export default {
  components: {
  },
  props: {
    level: {
      type: String,
      required: true,
      validator: (value) => Object.values(EXAM_LEVEL).includes(value)
    }
  },
  data() {
    return {
      EXAM_LEVEL: Object.freeze(EXAM_LEVEL),
      levelOpt: ''
    };
  },
  methods: {
    cloneData() {
      this.levelOpt = this.level;
    },
    changeValue(val) {
      this.$emit('change', val);
    }
  },
  created() {
    this.cloneData();
  }
}
</script>
<style lang="scss" scoped>

</style>