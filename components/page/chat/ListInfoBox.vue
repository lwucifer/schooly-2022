<template>
  <div class="list-info px-4 py-3" :class="{'no-hover': showContent}">
    <div class="list-info__header" @click.stop="showContent = !showContent">
      <div class="title">
        <slot name="header" />
      </div>

      <div class="icon-arrow">
        <IconKeyboardArrowDown24px class="fill-base" v-if="showContent" />
        <IconKeyboardArrowUp24px class="fill-base" v-else />
      </div>
    </div>

    <div class="list-info__body" v-if="showContent">
      <div class="mb-4">
        <slot name="button" />
      </div>

      <slot name="body" />
    </div>
  </div>
</template>

<script>
import IconKeyboardArrowDown24px from "~/assets/svg/v2-icons/keyboard_arrow_down_24px.svg?inline";
import IconKeyboardArrowUp24px from "~/assets/svg/v2-icons/keyboard_arrow_up_24px.svg?inline";

export default {
  components: {
    IconKeyboardArrowDown24px,
    IconKeyboardArrowUp24px
  },

  data() {
    return {
      showContent: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/message/_list-info-box.scss";
</style>