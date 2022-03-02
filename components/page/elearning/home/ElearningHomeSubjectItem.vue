<template>
  <n-link :to="to" class="eh-subject-item">
    <div class="eh-subject-item__icon">
      <slot name="icon"></slot>
    </div>

    <h3 class="eh-subject-item__title">{{ title }}</h3>
  </n-link>
</template>

<script>
export default {
  props: {
    title: String,
    to: {
      type: [String, Object], // Vue-router prop. Denotes the target route of the link.
      default: ''
    },
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/home/_elearning-home-subject-item.scss";
</style>
