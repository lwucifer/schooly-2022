<template>
  <div class="course-rates-comment">
    <div class="left">
      <div class="auth">
        <app-avatar :src="get(review, 'creator.avatar.low', '')" :size="40" />
        <strong class="ml-2">{{ get(review, "creator.name", "") }}</strong>
      </div>
      <app-stars
        :stars="Math.floor(get(review, 'vote', 0))"
        :size="16"
        class="mt-4 mb-3"
      />
      <p class="color-666">{{ get(review, "content", "") }}</p>
    </div>
    <div class="ml-auto d-flex-center color-666">
      <IconClock width="14" height="14" class="mr-2" />
      {{ get(review, "timestamp", "") }}
    </div>
  </div>
</template>
<script>
import IconClock from "~/assets/svg/icons/clock.svg?inline";
import { get } from "lodash";

export default {
  components: {
    IconClock
  },

  props: {
    review: {
      type: Object,
      default: () => {}
    }
  },

  methods: {
    get
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/_course-comment.scss";
</style>
