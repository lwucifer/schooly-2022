<template>
  <div>
    <h5 class="color-primary mb-3" v-if="title">{{ title }}</h5>
    <div class="elearning-manager-content__title__nav" v-if="tabs.length > 0">
      <a
        v-for="(item, index) in tabs"
        :key="index"
        :class="active == item.key ? 'active' : ''"
        @click="selectItem(item.key)"
      >
        {{ item.text }}
      </a>
      <!--<a :class="tab == 2 ? 'active' : ''" @click="tab = 2">Bài kiểm tra</a>-->
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '',
      },
      tabs: {
        type: Array,
        default: () => [],
        validator: value =>
          value.every(option => ["key", "text"].every(key => key in option))
      },
      active: {
        type: String
      }
    },
    data() {
      return {
        current: this.active
      }
    },
    methods: {
      selectItem(key) {
        this.$emit('selectedItem', key)
      }
    }
  }
</script>

<style scoped>

</style>