<template>
  <div v-if="loading" class="app-skeleton" :class="classes">
    <div class="app-skeleton__header">
      <div class="app-skeleton__avatar"></div>
      <div>
        <div class="app-skeleton__paragraph app-skeleton__paragraph--name"></div>
        <div class="app-skeleton__paragraph app-skeleton__paragraph--sub"></div>
      </div>
    </div>

    <div class="app-skeleton__content">
      <div class="app-skeleton__paragraph"></div>
      <div class="app-skeleton__paragraph"></div>
      <div class="app-skeleton__paragraph"></div>

      <div class="app-skeleton__media mt-4"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: true
    },
    loading: Boolean
  },

  computed: {
    classes() {
      return {
        'active': this.active,
        'animation': this.loading,
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-skeleton";
</style>