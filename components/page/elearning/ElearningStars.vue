<template>
  <div class="chart-stars">
    <div class="star">
      <strong class="mr-2">5</strong>
      <IconStarO />
      <div class="chart">
        <div :style="'width: ' + get(voting, 'vote5_rate.percent', 0) + '%'"></div>
      </div>
      <span class="text-gray">{{ get(voting, "vote5_rate.percent", 0) }} %</span>
    </div>

    <div class="star">
      <strong class="mr-2">4</strong>
      <IconStarO />
      <div class="chart">
        <div :style="'width: ' + get(voting, 'vote4_rate.percent', 0) + '%'"></div>
      </div>
      <span class="text-gray">{{ get(voting, "vote4_rate.percent", 0) }} %</span>
    </div>

    <div class="star">
      <strong class="mr-2">3</strong>
      <IconStarO />
      <div class="chart">
        <div :style="'width: ' + get(voting, 'vote3_rate.percent', 0) + '%'"></div>
      </div>
      <span class="text-gray">{{ get(voting, "vote3_rate.percent", 0) }} %</span>
    </div>

    <div class="star">
      <strong class="mr-2">2</strong>
      <IconStarO />
      <div class="chart">
        <div :style="'width: ' + get(voting, 'vote2_rate.percent', 0) + '%'"></div>
      </div>
      <span class="text-gray">{{ get(voting, "vote2_rate.percent", 0) }} %</span>
    </div>

    <div class="star">
      <strong class="mr-2">1</strong>
      <IconStarO />
      <div class="chart">
        <div :style="'width: ' + get(voting, 'vote1_rate.percent', 0) + '%'"></div>
      </div>
      <span class="text-gray">{{ get(voting, "vote1_rate.percent", 0) }} %</span>
    </div>
  </div>
</template>

<script>
import IconStarO from "~/assets/svg/icons/star-o.svg?inline";
import { get } from "lodash";

export default {
  components: {
    IconStarO
  },

  props: {
    voting: {}
  },

  methods: { get }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-stars.scss";
</style>
