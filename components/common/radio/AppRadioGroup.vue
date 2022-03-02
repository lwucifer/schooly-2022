<template>
  <div class="app-radio-group">
    <slot />
  </div>
</template>

<script>
export default {
  provide() {
    return {
      appRadioGroup: this
    }
  },

  model: {
    event: 'input',
    prop: 'checked'
  },

  props: {
    checked: {},
    name: {
      type: String,
      default: 'radio-group-' + new Date().getTime()
    }
  }
}
</script>

<style>
</style>