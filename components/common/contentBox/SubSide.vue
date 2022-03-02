<template>
  <div class="sub-side" :class="show ? 'open-side' : ''">
      <div class="sub-side-content">
        <slot name="content"></slot>
        
        <button class="btn-close-side" @click="show = false">
          <IconClose/>
        </button>
      </div>
      <button class="btn-toggle-side" @click="show = !show">
        <IconHamberger class="fill-primary"/>
      </button>
  </div>
</template>

<script>
  import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
  import IconClose from "~/assets/svg/icons/close.svg?inline";
  
  export default {
    components: {
      IconHamberger,
      IconClose
    },
    data() {
      return {
        show: false
      }
    },
  };
</script>

<style lang="scss">
  @import "~/assets/scss/components/app/_app-sub-side.scss";
</style>