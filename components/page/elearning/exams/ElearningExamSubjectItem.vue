<template>
  <n-link :to="to" class="subject-item">
    <div class="subject-item__icon">
      <slot name="icon"></slot>
    </div>

    <div class="subject-item__star">
        <img src="~assets/images/elearning/star-corner.png" alt="">
    </div>

    <h3 class="subject-item__title">{{ title }}</h3>
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
@import "~/assets/scss/components/elearning/exams/_elearning-exam-subject-item.scss";
</style>
