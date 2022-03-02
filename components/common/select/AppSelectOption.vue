<template>
  <div class="app-select-option" @click="handleClick">
    <slot />
  </div>
</template>

<script>
export default {
  inject: {
    appSelect: {
      default: null
    }
  },

  props: {
    value: {}
  },

  methods: {
    handleClick() {
      if (!this.appSelect) return;
      const { mode, value, hideOptions } = this.appSelect;

      if (mode && mode === "tags") {
        this.$emit("change", [...value, this.value]);
      } else {
        this.$emit("change", this.value)
      }

      hideOptions();
    }
  }
};
</script>

<style>
</style>