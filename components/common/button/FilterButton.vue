<template>
  <app-button
    :color="color"
    :loading="loading"
    :nuxt="nuxt"
    :flat="flat"
    :outline="outline"
    :full-width="fullWidth"
    :square="square"
    :rounded="rounded"
    :normal="normal"
    class="btn--filter"
    :size="size"
    :tag="tag"
    :to="to"
    :exact="exact"
    @click="click"
  >
    <slot name="icon">
      <icon-filter class="icon--btn icon--btn--pre"/>
    </slot>
    <slot>
      <span>Lọc kết quả</span>
    </slot>
  </app-button>
</template>

<script>
  import IconFilter from "~/assets/svg/icons/hamberger.svg?inline"
  
  export default {
    name: "FilterButton",
    components: {
      IconFilter
    },
    props: {
      color: {
        type: String,
        default: "white" // 'primary' | 'white', ...
      },
      size: {
        type: String,
        default: "sm" // 'sm' | 'md' | 'lg'
      },
      loading: Boolean,
      nuxt: Boolean,
      flat: Boolean,
      outline: Boolean,
      fullWidth: Boolean,
      square: Boolean,
      rounded: Boolean,
      normal: {
        type: Boolean,
        default: true
      },
      to: {
        type: [String, Object] // Vue-router prop. Denotes the target route of the link.
      },
      exact: {
        type: Boolean // Vue-router prop. Exactly match the link. Without this, '/' will match every route.
      },
      tag: {
        type: String,
        default: "button" // 'button', 'a'
      },
    },
    methods: {
      click() {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/app/_app-filter-button.scss";
</style>