<template>
  <label class="app-checkbox">
    <input
      type="checkbox"
      class="app-checkbox__input"
      hidden
      v-bind="$attrs"
      v-on="inputListeners"
      v-model="localChecked"
    />
    <span class="app-checkbox__checkmark" v-if="type ==1">
      <IconCheckBox class="app-checkbox__icon app-checkbox__icon--checked icon fill-opacity-1 fill-primary" />
      <IconCheckBoxOutlineBlank
        class="app-checkbox__icon app-checkbox__icon--unchecked icon fill-opacity-1"
      />
    </span>
    <span class="app-checkbox__checkmark" v-else-if="type ==2">
      <IconCheckBoxTick class="app-checkbox__icon app-checkbox__icon--checked icon fill-opacity-1 fill-primary" />
      <IconCheckBoxOutlineBlank
        class="app-checkbox__icon app-checkbox__icon--unchecked icon fill-opacity-1"
      />
    </span>
    <span v-if="!!vhtml" class="app-checkbox__text" :class="{'text-primary': checked && isChangeLabelColor}" v-html="vhtml">
    </span>
    <span v-else class="app-checkbox__text" :class="{'text-primary': checked && isChangeLabelColor}">
      <slot>{{ label }}</slot>
    </span>
    
  </label>
</template>

<script>
const IconCheckBox = () =>
  import("~/assets/svg/v2-icons/check_box_24px.svg?inline");
const IconCheckBoxOutlineBlank = () =>
  import("~/assets/svg/v2-icons/check_box_outline_blank_24px.svg?inline");
import IconCheckBoxTick from '~/assets/svg/icons/check-box-tick.svg?inline';
export default {
  inheritAttrs: false,

  components: {
    IconCheckBox,
    IconCheckBoxOutlineBlank,
    IconCheckBoxTick
  },

  model: {
    prop: "checked",
    event: "change"
  },

  props: {
    checked: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    isChangeLabelColor: {
      type: Boolean,
      default: false
    },
    type:{
      type: Number,
      default: 1
    },
    vhtml: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      localChecked: this.checked
    }
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
          change: (event) => this.handleChange(event),
        }
      );
    },
  },

  watch: {
    checked(newValue) {
      this.localChecked = newValue
    },

    localChecked(newValue) {
      this.$emit("change", newValue)
    }
  },

  methods: {
    handleChange(e) {
      this.localChecked = e.target.checked;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-checkbox.scss";
</style>