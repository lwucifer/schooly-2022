<template>
  <div class="edq_section">
    <h5 class="edq__section-title">Nội dung câu hỏi</h5>
    <div>
      <div v-if="note" class="d-flex mb-3">
        <p class="mr-2">
          <IconWarning class="fill-color-base" />
        </p>
        <p v-html="note"></p>
      </div>
      <app-editor class="w-100" v-model="contentOpt" @input="changeContent" />
    </div>
  </div>
</template>
<script>
import IconWarning from "~/assets/svg/v2-icons/error_outline_24px.svg?inline";

export default {
  components: {
    IconWarning,
  },
  props: {
    content: {
      type: String | Number,
      default: "",
    },
    note: {
      type: String,
    },
  },
  data() {
    return {
      contentOpt: "",
    };
  },
  methods: {
    cloneData() {
      this.contentOpt = this.content;
    },
    changeContent(val) {
      this.$emit("change", val);
    },
  },
  created() {
    this.cloneData();
  },
};
</script>
<style lang="scss" scoped>
</style>