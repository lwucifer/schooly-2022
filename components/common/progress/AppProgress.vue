<template>
  <div>
    <div class="app-progress" :class="prgClasses">
      <div
        class="app-progress__inner"
        :class="innerClasses"
        :style="{ ...{ width: percentage + '%' }, ...innerOptions }"
      >
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AppProgress",
    props: {
      innerOptions: {
        type: Object,
        default: () => {}
      },
      percentage: {
        type: String | Number,
        validator: value => {
          return parseInt(value) >= 0 && parseInt(value) <= 100
        },
        default: 0
      },
      size: {
        type: String,
        default: 'md' //sm, md, lg
      },
      color: {
        type: String,
        default: 'primary' //secondary, info, success, ....
      },
      rounded: {
        type: Boolean
      },
      square: {
        type: Boolean,
      },
      normal: {
        type: Boolean
      }
    },
    computed: {
      prgClasses() {
        const sizeClasses = {
          'app-progress--size-sm': this.size === 'sm',
          'app-progress--size-md': this.size === 'md',
          'app-progress--size-lg': this.size === 'lg',
        }
        
        const styleClasses = {
          'app-progress--rounded': this.rounded,
          'app-progress--square': this.square,
          'app-progress--normal': this.normal,
        }
        
        const colorClasses = {
          'app-progress--color-primary': this.color === 'primary',
          'app-progress--color-secondary': this.color === 'secondary',
          'app-progress--color-info': this.color === 'info',
          'app-progress--color-success': this.color === 'success',
          'app-progress--color-error': this.color === 'error',
          'app-progress--color-warning': this.color === 'warning',
          'app-progress--color-disabled': this.color === 'disabled',
        }
        
        return {
          ...sizeClasses,
          ...styleClasses,
          ...colorClasses
        }
      },
      innerClasses() {
        const styleClasses = {
          'app-progress__inner--full': parseInt(this.percentage) == 100,
          'app-progress__inner--not-full': parseInt(this.percentage) < 100,
        }
        return {
          ...styleClasses
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~/assets/scss/components/app/_app-progress.scss";
</style>