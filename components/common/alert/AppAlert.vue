<template>
  <div v-if="show" class="app-alert" :class="classes">
    <div class="app-alert__icon-wrapper" v-if="showIcon && !!icon">
      <slot name="icon">
        <component :is="icon" class="app-alert__icon icon" />
      </slot>
    </div>
    <div class="app-alert__content">
      <slot />
    </div>

    <a v-if="showClose" href class="app-alert__close" @click.prevent="close">
      <IconClose class="icon" />
    </a>
  </div>
</template>

<script>
const IconExclamationTriangle = () =>
  import("~/assets/svg/design-icons/exclamation-triangle.svg?inline");
const IconAlert = () => import("~/assets/svg/v2-icons/alert/error_24px.svg?inline")
const IconClose = () => import("~/assets/svg/icons/close.svg?inline");

export default {
  components: {
    IconClose
  },

  props: {
    showIcon: {
      type: Boolean,
      default: true
    },
    showClose: Boolean,
    type: {
      type: String,
      default: "primary",
      validator: value =>
        ["primary", "secondary", "success", "danger", "warning", "info"].includes(value)
    },
    size: {
      type: String,
      default: "",
      validator: value => ['', 'sm'].includes(value)
    }
  },

  data: () => ({
    show: true
  }),

  computed: {
    classes() {
      return {
        // Type classes
        "app-alert--primary": this.type === "primary",
        "app-alert--secondary": this.type === "secondary",
        "app-alert--success": this.type === "success",
        "app-alert--danger": this.type === "danger",
        "app-alert--warning-2": this.type === "warning",
        "app-alert--light": this.type === "light",
        "app-alert--dark": this.type === "dark",
        "app-alert--info": this.type === "info",
        // Options classes
        "app-alert--has-close": this.showClose,
        "app-alert--size-sm": this.size === "sm"
      };
    },

    icon() {
      switch (this.type) {
        case "secondary":
          return IconExclamationTriangle;
          break;

        case "warning":
          return IconAlert;
          break;

        default:
          return null;
          break;
      }
    }
  },

  methods: {
    close() {
      this.show = false;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-alert.scss";
</style>