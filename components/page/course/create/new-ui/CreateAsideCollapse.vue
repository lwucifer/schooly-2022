<template>
  <div class="create-aside-collapse" :class="{ 'collapsed': collapsed }">
    <div class="create-aside-collapse__title" @click="collapsed = !collapsed">
      <slot name="title">
        <h3 class="create-aside-collapse__heading">{{ title }}</h3>
      </slot>

      <div class="create-aside-collapse__arrow">
        <IconArrowDropUp class="d-block icon fill-opacity-1" />
      </div>
    </div>

    <transition name="collapse">
      <div v-if="!collapsed" class="create-aside-collapse__content">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
import IconArrowDropUp from "~/assets/svg/v2-icons/arrow_drop_up_24px.svg?inline";

export default {
  components: {
    IconArrowDropUp,
  },

  props: {
    title: String,
  },

  data: () => ({
    collapsed: false,
  }),
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_create-aside-collapse.scss";
</style>