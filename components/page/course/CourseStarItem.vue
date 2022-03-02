<template>
  <div class="star">
    <strong class="mr-2">{{ get(rate, "rate", 0) }}</strong>
    <IconStarO v-if="get(rate, 'rate', 0) < 100" />
    <IconStar v-else />
    <div class="chart">
      <div :style="'width: ' + get(rate, 'percent', 0) + '%'"></div>
    </div>
    <div class="ml-2 text-center" style="min-width: 60px;">{{ get(rate, "percent", 0) }}%</div>
  </div>
</template>

<script>
import IconStar from "~/assets/svg/icons/star.svg?inline";
import IconStarO from "~/assets/svg/icons/star-o.svg?inline";
import { get } from "lodash";

export default {
  components: {
    IconStar,
    IconStarO
  },

  props: {
    rate: {
      type: Object,
      default: null
    }
  },

  methods: {
    get
  }
};
</script>
