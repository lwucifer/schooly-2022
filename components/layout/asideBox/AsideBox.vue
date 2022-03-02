<template>
  <aside class="aside-box">
    <div class="aside-box__top" v-if="title.length || link">
      <h3 class="aside-box__title" v-if="title.length">{{ title }}</h3>
      <n-link v-if="link" :to="link || ''" class="aside-box__link">{{ linkText }}</n-link>
    </div>

    <div class="aside-box__content">
      <slot />
    </div>
  </aside>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    link: {
      type: [String, Object],
    },
    linkText: {
      type: String,
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/aside-box/_aside-box.scss";
</style>