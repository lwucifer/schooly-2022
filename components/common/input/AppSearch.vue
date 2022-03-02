<template>
  <app-input
    class="app-search"
    :class="{ 'app-search--bordered': bordered }"
    v-bind="{ ...$attrs, ...$props }"
    @input="handleInput"
    @keyup.enter="submit"
  >
    <app-button
      slot="append-inner"
      class="app-search__submit"
      :size="$attrs.size"
      v-bind="buttonProps"
      @click="submit"
    >
      <IconSearch class="icon" />
    </app-button>
  </app-input>
</template>

<script>
import IconSearch from "~/assets/svg/icons/search.svg?inline";
export default {
  inheritAttrs: false,

  components: {
    IconSearch
  },

  model: {
    prop: "value",
    event: "input"
  },

  props: {
    value: {
      type: [String, Number],
      required: false,
      default: ""
    },
    buttonProps: {
      type: Object,
      default: () => ({})
    },
    bordered: Boolean
  },

  data() {
    return {
      localValue: this.value
    };
  },

  watch: {
    value(newValue) {
      this.localValue = newValue;
    },

    localValue(newValue) {
      this.$emit("input", newValue);
    }
  },

  methods: {
    submit(event) {
      this.$emit("submit", this.localValue);
    },

    handleInput(value) {
      this.localValue = value;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-search.scss";
</style>