<template functional>
  <span
    :class="{
      'app-breadcrumb-item': true,
      'app-breadcrumb-item--is-current': props.isCurrent,
      'app-breadcrumb-item--disabled': props.disabled
    }"
  >
    <slot>
      <n-link v-if="props.nuxt" :to="props.to" :exact="props.exact">{{ props.name }}</n-link>
      <span v-else>{{ props.name }}</span>
    </slot>
  </span>
</template>

<script>
export default {
  name: "app-breadcrumb-item",

  props: {
    href: String,
    target: {
      type: String,
      default: "_self" // default on browser
    },
    nuxt: Boolean,
    to: {
      type: [String, Object] // Vue-router prop. Denotes the target route of the link.
    },
    exact: {
      type: Boolean // Vue-router prop. Exactly match the link. Without this, '/' will match every route.
    },
    name: {
      type: String
    },
    isCurrent: Boolean,
    disabled: Boolean
  }
};
</script>

<style>
</style>