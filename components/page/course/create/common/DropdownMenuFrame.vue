<template>
  <app-dropdown
    class="dropdown-frame-border"
    position="right"
  >
    <template v-slot:activator>
      <div class="d-flex align-items-center dropdown-frame-border-title">
        <IconSetting class="dropdown-frame-menu--stroke-icon" />
        <IconArrow class="ml-2 dropdown-frame-menu--fill-icon"/>
      </div>
    </template>
    <slot />
  </app-dropdown>
</template>

<script>
import IconSetting from "~/assets/svg/v2-icons/settings.svg?inline";
import IconArrow from "~/assets/svg/v2-icons/arrow_bottom.svg?inline";

export default {
  components: {
    IconSetting,
    IconArrow
  }
}
</script>

<style lang="scss">

</style>