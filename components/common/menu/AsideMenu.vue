<template>
  <div class="aside-menu">
    <div
      class="aside-menu__item"
      v-for="(item, index) in items"
      :class="seletedKey == item.key ? 'active' : ''"
      :key="index"
      @click="clickMenu(item)"
    >
      <n-link class="link-gray" :to='item.link'>
        <span>
          <component
            :is="getIconComponent(item.icon)"
            class="icon"
          />
        </span>
        <span>
          {{ item.label }}
        </span>
      </n-link>
    </div>
  </div>
</template>

<script>
  import { map } from 'lodash'
  
  export default {
    components: {},
    data() {
      return {
      }
    },
    props: {
      items: {
        type: Array,
        // The namespace of icon must be `~/assets/svg/icons/`
        validator: value =>
          value.every(item => ["label", "key", "icon", "link"].every(key => key in item)),
        default: () => []
      },
      selectedItem: {
        type: String|Number,
        required: true
      },
    },
    computed: {
      seletedKey: function() {
        const keyValues = this.items.map(function (el) { return el.key })
        if(!keyValues.includes(this.selectedItem)) {
          if (this.items.length > 0) {
            return this.items[0].key
          }
        } else
          return this.selectedItem
      }
    },
    methods: {
      getIconComponent(pathToFile) {
        try {
          const req = require('~/assets/svg/icons/' + pathToFile + '?inline')
          return req.default
        } catch (e) {
          const req = require('~/assets/svg/icons/default-aside-menu.svg?inline')
          return req.default
        }
      },
      clickMenu(item) {
        this.$emit('click', item)
      }
    },
    created() {
    }
  };
</script>

<style lang="scss">
  @import "~/assets/scss/components/menu/_aside-menu.scss";
</style>