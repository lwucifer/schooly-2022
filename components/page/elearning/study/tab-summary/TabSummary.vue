<template>
  <div class="e-study-tab-summary">
    <!-- <div class="mb-6">
      <h4 class="mb-5">Phù hợp với</h4>
    </div> -->

    <div class="mb-6">
      <h4 class="mb-5">Mô tả</h4>
      <div v-html="get(info, 'description', '')" class="e-study-tab-summary__text"></div>
    </div>

    <!-- <div>
      <h4 class="mb-5">Yêu cầu</h4>
    </div> -->
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  props: {
    info: {}
  },
  methods: { get }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/_tab-summnary.scss";
</style>