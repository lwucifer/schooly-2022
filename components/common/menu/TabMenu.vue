<template>
  <ul class="tab-menu">
    <li
      class="tab-menu__item"
      v-for="(item, index) in list"
      :key="index"
      :title="item.text"
      :class="active == item.key ? 'active' : ''"
      @click="selectItem(item.key)"
    >
      <a :title="item.text">{{ item.text }}</a>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "TabMenu",
    props: {
      active: {
        type: String,
        required: true
      },
      list: {
        type: Array,
        default: () => [],
        validator: value =>
          value.every(option => ["key", "text"].every(key => key in option)) // key, text, action
      }
    },
    methods: {
      selectItem(key) {
        this.$emit('selectedItem', key)
      }
    }
  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/menu/_tab-menu.scss";
</style>