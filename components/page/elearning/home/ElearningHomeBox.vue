<template>
  <section class="elearning-home-box">
    <div v-if="$slots['title-right']" class="elearning-home-box__title mb-3">
      <slot name="title">
        <h2 class="heading-3 font-weight-semi-bold">{{ title }}</h2>
      </slot>

      <slot name="title-right"></slot>
    </div>

    <slot v-else name="title">
      <h2 class="heading-3 font-weight-semi-bold mb-3">{{ title }}</h2>
    </slot>

    <slot />
  </section>
</template>

<script>
export default {
  props: {
    title: String
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/home/_elearning-home-box.scss";
</style>