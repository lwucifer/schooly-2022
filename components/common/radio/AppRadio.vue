<template>
  <label class="app-radio">
    <input
      type="radio"
      class="app-radio__input"
      v-bind="$attrs"
      :value="value"
      :name="name"
      :checked="typeof localChecked === 'boolean' ? localChecked : localChecked === value"
      v-on="inputListeners"
    />
    <span class="app-radio__decor">
      <span class="app-radio__decor__inner"></span>
    </span>

    <span v-if="!!vhtml" class="app-radio__text">
      <span v-html="vhtml">
        <slot />
      </span>
    </span>
    <span class="app-radio__text" v-else>
      <slot />
    </span>
  </label>
</template>

<script>
export default {
  inheritAttrs: false,

  inject: {
    appRadioGroup: {
      default: null
    }
  },

  model: {
    prop: "checked",
    event: "input"
  },

  props: {
    checked: {
      // v-model
      type: [String, Number, Boolean, Object],
      default: null
    },
    value: {},
    name: {
      type: [String, Number],
      default() {
        return this.appRadioGroup ? this.appRadioGroup.name : "";
      }
    },
    vhtml: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      localChecked: this.checked
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
          input: event => {
            this.handleInput(event);
          }
        }
      );
    }
  },

  watch: {
    checked(newValue) {
      this.localChecked = newValue;
    }
  },

  methods: {
    handleInput({ target: { checked } }) {
      this.localChecked = checked;
      this.$emit("input", checked ? this.value : null);

      if (this.appRadioGroup) {
        this.appRadioGroup.$emit("input", checked ? this.value : null);
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-radio.scss";
</style>