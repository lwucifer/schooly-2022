<template>
  <div class="app-search">
    <div class="app-search__input">
      <!-- Input Text  -->
      <input
        v-bind="$attrs"
        type="text"
        :value="localValue"
        :placeholder="placeholder"
        v-on="inputListeners"
      />

      <slot name="submit-btn">
        <button
          class="submit-btn"
          @click="submit"
        >
          <IconSearch width="20" height="20" />
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
import IconSearch from "~/assets/svg/icons/search.svg?inline"

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
    placeholder: {
      type: String,
      required: false,
      default: ""
    },
  },

  data() {
    return {
      localValue: this.value,
      isFocus: false
    };
  },

  computed: {
    inputListeners: function() {
      const vm = this;
      // `Object.assign` merges objects together to form a new object
      return Object.assign(
        {},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          input: event => this.updateInput(event),
          blur: event => this.handleBlur(event),
          focus: event => this.handleFocus(event)
        }
      );
    }
  },

  watch: {
    value(newValue) {
      this.localValue = newValue;
    },
  },

  methods: {
    updateInput: function(event) {
      this.localValue = event.target.value;
      this.$emit("input", event.target.value);
    },

    handleFocus(event) {
      this.isFocus = true;
    },

    handleBlur(event) {
      this.isFocus = false;
    },

    submit: function(event) {
      this.$emit("submit", this.localValue);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/app/_app-search-header.scss";
</style>