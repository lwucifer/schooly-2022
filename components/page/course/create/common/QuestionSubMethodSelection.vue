<template>
  <div class="edq_section h-100">
    <h5 class="edq__section-title">Hình thức nộp bài</h5>
    <div class="edq__sub-methods ml-2">
      <!-- <app-checkbox
        @change="changeValue($event, SUBMISSION_METHODS['MANUAL'])"
        value="MANUAL"
        :checked="isManual"
        class="mr-6"
      >
      Nhập văn bản</app-checkbox>
      <app-checkbox
        @change="changeValue($event, SUBMISSION_METHODS['UPLOAD'])"
        value="UPLOAD"
        :checked="isUpload">
      Tải file
      </app-checkbox> -->

       <app-radio
        @input="switchType(SUBMISSION_METHODS['MANUAL'])"
        value="MANUAL"
        :checked="subMethod == SUBMISSION_METHODS['MANUAL']"
        class="mr-6"
        name="sub-method"
      >
      Nhập văn bản</app-radio>
      <app-radio
        @input="switchType(SUBMISSION_METHODS['UPLOAD'])"
        value="UPLOAD"
        :checked="subMethod == SUBMISSION_METHODS['UPLOAD']"
        name="sub-method"
      >
      Tải file
      </app-radio>
    </div>
  </div>
</template>
<script>
import { SUBMISSION_METHODS } from "~/utils/constants";

export default {
  components: {},
  props: {
    ways: {
      type: String,
    },
  },
  data() {
    return {
      SUBMISSION_METHODS: Object.freeze(SUBMISSION_METHODS),
      waysOpt: "",
      way: this.ways,
      isUpload: false,
      isManual: false,
      subMethod: ""
    };
  },
  methods: {
    cloneData() {
      this.waysOpt = Object.assign({}, this.ways);
    },
    initData() {
      if (this.ways == SUBMISSION_METHODS['MANUAL']) {
        this.isManual = true;
      } else if (this.ways == SUBMISSION_METHODS['UPLOAD']) {
        this.isUpload = true;
      } else if (this.ways == SUBMISSION_METHODS['BOTH']) {
        this.isUpload = true;
        this.isManual = true;
      }
    },
    changeValue(checked, val) {
      if (val == SUBMISSION_METHODS['MANUAL']) {
        this.isManual = checked;
      } else if (val == SUBMISSION_METHODS['UPLOAD']) {
        this.isUpload = checked;
      }
      let type;
      if (this.isManual && this.isUpload) {
        type = SUBMISSION_METHODS['BOTH'];
      } else {
        type = this.isManual ? SUBMISSION_METHODS['MANUAL'] : (this.isUpload ? SUBMISSION_METHODS['UPLOAD']: '');
      }
      this.$emit("change", type);
    },
    switchType(type) {
      this.subMethod = type;
      this.$emit("change", type);
    }
  },
  created() {
    // this.initData();
    this.subMethod = this.ways;
  },
};
</script>
<style lang="scss" scoped>
</style>