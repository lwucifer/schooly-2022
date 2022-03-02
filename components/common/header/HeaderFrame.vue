<template>
  <div class="the-header">
    <div class="container-fluid the-header__content">
      <div class="the-header__logo">
        <n-link to="/">
          <Logo />
        </n-link>
      </div>
      <app-search-header
        :placeholder="searchPlaceholder"
      >
      </app-search-header>

      <div class="the-header__function-menu">
        <slot name="functionMenu"></slot>
      </div>

      <div class="the-header__right">
        <slot name="rightMenu"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import Logo from "~/assets/svg/logo/schoolly.svg?inline";

  export default {
    components: {
      Logo,
    },

    props: {
      searchPlaceholder: {
        type: String,
        default: ''
      }
    },
    computed: {
    },
    methods: {
    }
  };
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/header-frame/_header-frame.scss";
</style>