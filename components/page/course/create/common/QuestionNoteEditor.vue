<template>
  <div class="edq_section">
    <div>
      <h5 class="edq__section-title">
        <button class="d-flex align-items-center" @click="isExpanding = !isExpanding">
          <IconChevronRight :class="{ 'rotate90': isExpanding }"/>
          <span>Ghi chú</span>
          <IconHelp class="ml-2" height="16px" width="16px"/>
        </button>
      </h5>
      <div v-if="isExpanding" class="">
        <app-input
          class="mb-0"
          placeholder="Viết ghi chú..."
          textarea
          v-model="contentOpt"
          :rows=1
          @input="changeContent"
        ></app-input>
      </div>
    </div>
  </div>
</template>
<script>
import IconChevronRight from "~/assets/svg/v2-icons/chevron_right_24px.svg?inline";
import IconHelp from "~/assets/svg/v2-icons/help_24px.svg?inline";

export default {
  components: {
    IconChevronRight,
    IconHelp
  },
  props: {
    content: {
      type: String | Number,
      default: ''
    }
  },
  data() {
    return {
      contentOpt: '',
      isExpanding: false
    };
  },
  methods: {
    cloneData() {
      this.contentOpt = this.content;
    },
    changeContent(val) {
      this.$emit('change', val);
    }
  },
  created() {
    this.cloneData();
  }
}
</script>
<style lang="scss" scoped>
  .rotate90 {
    transform: rotate(90deg);
  }
</style>