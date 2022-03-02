<template>
  <div class="app-stars" :class="size < 16 ? 'sm' : 'lg'">
    <IconStar class="star"
      :width="size"
      :height="size"
      v-for="(i,index) in loopNumber"
      :key="index"
    />

    <IconHalfStar class="star"
      :width="size"
      :height="size"
      v-if="halfStar"
    />
    <IconStar class="star"
      :width="size"
      :height="size"
      v-if="!halfStar && stars > 0"
    />

    <IconStarO class="star"
      :width="size"
      :height="size"
      v-for="(i,index) in unstart"
      :key="index + 'unstart'"
    />
  </div>
</template>

<script>
import IconHalfStar from "~/assets/svg/icons/half-star.svg?inline";
import IconStar from "~/assets/svg/icons/star.svg?inline";
import IconStarO from "~/assets/svg/icons/star-o.svg?inline";

export default {
  components: {
    IconStar,
    IconStarO,
    IconHalfStar
  },

  computed: {
    loopNumber: function() {
      return Math.ceil(parseFloat(this.stars)) > 1 ? Math.ceil(parseFloat(this.stars)) - 1 : 0
    },
    unstart: function() {
      return 5 - Math.ceil(parseFloat(this.stars))
    },
    halfStar: function() {
      return Math.floor(parseFloat(this.stars)) < parseFloat(this.stars)
    },
  },

  props: {
    size: {
      type: Number,
      default: 12
    },
    stars: {
      type: [String, Number],
      default: '0'
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-stars.scss";
</style>