<template>
  <div class="content-box">
    <div class="content-box__title">
      <slot name="head">
        <h5 class="color-primary mb-3">{{ title }}</h5>
      </slot>
      <hr class/>
    </div>

    <div class="content-box__main">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {
      title: {
        type: String,
        required: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/district-department/account/_content-box.scss";
</style>