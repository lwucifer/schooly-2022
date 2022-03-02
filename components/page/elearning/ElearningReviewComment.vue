<template>
  <div class="elearning-review-comment">
    <app-avatar
      class="elearning-review-comment__avatar mr-3"
      :src="get(review, 'creator.avatar.low', '')"
      :size="40"
    />

    <div class="elearning-review-comment__right flex-grow">
      <div class="elearning-review-comment__top d-flex-center">
        <div class="elearning-review-comment__info mr-5">
          <span class="font-weight-bold text-dark">{{ get(review, "creator.name", "") }}</span>
          <app-stars :stars="get(review, 'vote', 0)" :size="15" class="ml-3" />
        </div>

        <div class="d-flex-center caption ml-auto">
          <IconClock class="icon body-1 mr-2" />
          {{ get(review, "timestamp", "") | getDateTimeHH_MM_D_M_Y }}
        </div>
      </div>
      <p
        class="elearning-review-comment__content word-break-all"
      >
        {{ get(review, "comment", "") }}
      </p>
    </div>
  </div>
</template>
<script>
import { DATETIME_DISPLAY, DATETIME_RECEIVE } from "~/utils/config";
import IconClock from "~/assets/svg/design-icons/clock.svg?inline";
import { get } from "lodash";

export default {
  components: {
    IconClock
  },

  data() {
    return {
      DATETIME_DISPLAY,
      DATETIME_RECEIVE
    };
  },

  props: {
    review: {}
  },

  methods: {
    get
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-review-comment.scss";
</style>
