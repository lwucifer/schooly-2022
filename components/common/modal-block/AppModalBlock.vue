<template>
  <div
    class="app-modal-block-content"
    :class="{ ...classes, ...componentClass }"
    :style="{
      width: typeof width === 'number' ? width + 'px' : width,
      maxWidth: typeof maxWidth === 'number' ? maxWidth + 'px' : maxWidth,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    width: {
      type: [Number, String],
      default: 461 // number in px or css value
    },
    maxWidth: {
      type: [Number, String]
    },
    componentClass: {
      type: Object,
      default: () => {}
    },
    centered: {
      type: Boolean,
      default: true
    },
    visible: Boolean
  },

  computed: {
    classes() {
      return {
      };
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-modal-block.scss";
</style>