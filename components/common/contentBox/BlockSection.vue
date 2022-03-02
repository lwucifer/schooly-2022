<template>
  <div class="block-section" :class="blockCls">
    <div
      class="block-section__title"
      :class="titleCls"
    >
      <slot name="title">
        <h3 class="block-section__title--main" :class="titleType" @click="clickTitle">
          <span @click="clickBack" class="d-flex align-items-center">
            <icon-left-arrow v-if="hasIcon" class="block-section__icon-title" title="Quay lại"/>
          </span>
          {{ title }}
        </h3>
      </slot>
    </div>
    
    <div class="block-section__main">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
  import IconLeftArrow from "~/assets/svg/icons/left-arrow.svg?inline";
  
  export default {
    components: {
      IconLeftArrow
    },
    props: {
      titleTag: {
        type: String,
        default: 'h3'
      },
      title: {
        type: String,
        required: true
      },
      actionClick: { // Action when click arrow icon
        type: Function
      },
      hasIcon: {
        type: Boolean,
        default: false
      },
      blockCls: {
        type: Object,
        default: () => {}
      },
      titleCls: {
        type: Object,
        default: () => {}
      },
    },
    computed: {
      titleType() {
        if (this.titleTag == 'h1') {
          return { h1: true }
        } else if (this.titleTag == 'h2') {
          return { h2: true }
        } else if (this.titleTag == 'h3') {
          return { h3: true }
        } else if (this.titleTag == 'h4') {
          return { h4: true }
        } else if (this.titleTag == 'h5') {
          return { h5: true }
        } else if (this.titleTag == 'h6') {
          return { h6: true }
        }
      }
    },
    methods: {
      clickTitle() {
        this.$emit('click')
      },
      clickBack() {
        if (this.actionClick) {
          this.actionClick()
        } else {
          this.$router.go("-1")
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~/assets/scss/components/app/_app-block-section.scss";
</style>