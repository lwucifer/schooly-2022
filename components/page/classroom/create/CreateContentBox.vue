<template>
  <div class="create-content-box">
    <div class="create-content-box__title">
      <slot name="head">
        <h5 class="color-primary mb-3">{{ title }}</h5>
      </slot>
      <hr class/>
    </div>

    <div class="create-content-box__main">
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
  @import "~/assets/scss/components/classroom/create/_create-content-box.scss";
</style>