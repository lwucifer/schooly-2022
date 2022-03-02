<template>
  <div class="sub-block-section" :class="{ ...blockCls, ...classes }">
    <div
      v-if="hasTitle"
      class="sub-block-section__title"
      :class="titleCls"
    >
      <slot name="title" class="sub-block-section__title">
        <h4 class="sub-block-section__title--main">
          <span @click="clickBack" class="d-flex align-items-center">
            <icon-left-arrow
            v-if="hasIcon"
            class="sub-block-section__icon-title"
            
          /></span>
          <span>{{ title }}</span>
        </h4>
      </slot>
    </div>
    
    <div class="sub-block-section__main" :class="{ ...contentCls, ...ctnCls }">
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
      outline: {
        type: Boolean,
        default: true
      },
      blockCls: {
        type: Object,
        default: () => {}
      },
      hasTitle: {
        type: Boolean,
        default: true
      },
      titleCls: {
        type: Object,
        default: () => {}
      },
      contentCls: {
        type: Object,
        default: () => {}
      },
      title: {
        type: String,
        default: ''
      },
      actionClick: { // Action when click arrow icon
        type: Function
      },
      hasIcon: {
        type: Boolean,
        default: false
      },
      bgContentColor: {
        type: String,
        default: 'white'
      }
    },
    computed: {
      classes: function () {
        const styleCls = {
          'sub-block-section--outline': this.outline
        }
      },
      ctnCls() {
        const bgCls = {
          'sub-block-section__main--bg-transparent': this.bgContentColor === 'transparent',
          'sub-block-section__main--bg-primary': this.bgContentColor === 'primary',
          'sub-block-section__main--bg-secondary': this.bgContentColor === 'secondary',
          'sub-block-section__main--bg-info': this.bgContentColor === 'info',
          'sub-block-section__main--bg-success': this.bgContentColor === 'success',
          'sub-block-section__main--bg-error': this.bgContentColor === 'error',
          'sub-block-section__main--bg-warning': this.bgContentColor === 'warning',
          'sub-block-section__main--bg-gray': this.bgContentColor === 'gray',
          'sub-block-section__main--bg-input-gray': this.bgContentColor === 'input-gray',
          'sub-block-section__main--bg-white': this.bgContentColor === 'white',
          'sub-block-section__main--bg-black': this.bgContentColor === 'black',
          'sub-block-section__main--bg-light-2': this.bgContentColor === 'light-2',
        }
        return {
          ...bgCls
        }
      }
    },
    methods: {
      clickBack() {
        if (this.actionClick) {
          this.actionClick()
        } else {
          this.$router.go("-1")
        }
        console.log('go back')
      }
    }
  };
</script>

<style lang="scss">
  @import "~/assets/scss/components/app/_app-sub-block-section.scss";
</style>