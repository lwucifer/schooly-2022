<template>
  <app-modal-block
    class="app-modal-block-noti-status"
    :class="classes"
    :width="width"
    :max-width="maxWidth"
    :component-class="componentClass"
  >
    <template slot="default" >
      <slot>
        <slot name="icon">
          <div class="icon-status">
            <icon-success v-if="status == 'success'" />
            <icon-success v-if="status == 'error'" />
            <icon-success v-if="status == 'warning'" />
          </div>
        </slot>
  
        <slot name="title">
          <div
            class="app-modal-block-noti-status__title"
            :class="titleClasses"
          >
            {{ title }}
          </div>
        </slot>
  
        <slot
          v-if="description"
          name="description"
        >
          <div
            class="app-modal-block-noti-status__description"
            :class="descriptionClass"
          >
            {{ description }}
          </div>
        </slot>
  
        <slot name="footer"></slot>
      </slot>
    </template>
  </app-modal-block>
</template>

<script>
  import IconSuccess from '~/assets/svg/icons/success.svg?inline';
  
  export default {
    components: {
      IconSuccess
    },
    props: {
      width: {
        type: [Number, String],
        default: 461 // number in px or css value
      },
      maxWidth: {
        type: [Number, String]
      },
      componentClass: {
        type: Object,
        default: () => {}
      },
      descriptionClass: {
        type: Object,
        default: () => {}
      },
      status: { //success, error, warning
        type: String,
        default: 'success'
      },
      title: {
        type: String,
        default: ''
      },
      titleColor: {
        type: String,
        default: 'primary'
      },
      description: {
        type: String,
      },
    },
  
    computed: {
      classes() {
        return {
          'app-modal-block-noti-status--success': this.status == 'success',
          'app-modal-block-noti-status--error': this.status == 'error',
          'app-modal-block-noti-status--warning': this.status == 'warning',
        };
      },
      titleClasses() {
        return {
          'app-modal-block-noti-status__title--primary': this.titleColor === 'primary',
          'app-modal-block-noti-status__title--secondary': this.titleColor === 'secondary',
          'app-modal-block-noti-status__title--info': this.titleColor === 'info',
          'app-modal-block-noti-status__title--success': this.titleColor === 'success',
          'app-modal-block-noti-status__title--error': this.titleColor === 'error',
          'app-modal-block-noti-status__title--warning': this.titleColor === 'warning',
          'app-modal-block-noti-status__title--disabled': this.titleColor === 'disabled',
        }
      }
    }
  };
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-modal-block-noti-status.scss";
</style>