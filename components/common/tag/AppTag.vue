<template>
  <span class="app-tag">
    <slot />
    <i v-if="showClose" class="app-tag__close" @click="handleClose">
      <IconClose class="icon" />
    </i>
  </span>
</template>

<script>
const IconClose = () => import("~/assets/svg/icons/close.svg?inline");

export default {
  components: {
    IconClose
  },

  props: {
    showClose: Boolean
  },

  methods: {
    handleClose(event) {
      this.$emit('close', event)
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-tag.scss";
</style>
