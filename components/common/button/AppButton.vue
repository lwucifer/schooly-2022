<script>
export default {
  props: {
    nuxt: Boolean,
    flat: Boolean,
    outline: Boolean,
    fullWidth: Boolean,
    square: Boolean,
    rounded: Boolean,
    normal: Boolean,
    tag: {
      type: String,
      default: "button" // 'button', 'a'
    },
    size: {
      type: String,
      default: "md" // 'xs' | 'sm' | 'md' | 'lg'
    },
    color: {
      type: String,
      default: "primary" // 'primary' | 'white', ...
    },
    to: {
      type: [String, Object] // Vue-router prop. Denotes the target route of the link.
    },
    exact: {
      type: Boolean // Vue-router prop. Exactly match the link. Without this, '/' will match every route.
    },
    loading: Boolean,
    loadingType: {
      type: String,
      default: "circle"
    },
    pointer: {
      type: Boolean,
      default: true,
    }
  },

  computed: {
    classes() {
      const sizeClasses = {
        "btn--size-xs": this.size === "xs",
        "btn--size-sm": this.size === "sm",
        "btn--size-md": this.size === "md",
        "btn--size-lg": this.size === "lg",
        "btn--size-xl": this.size === "xl",
        "btn--full-width": this.fullWidth
      };

      const colorClasses = {
        "btn--color-pink": this.color === "pink",
        "btn--color-primary": this.color === "primary",
        "btn--color-secondary": this.color === "secondary",
        "btn--color-info": this.color === "info",
        "btn--color-success": this.color === "success",
        "btn--color-error": this.color === "error",
        "btn--color-warning": this.color === "warning",
        "btn--color-white": this.color === "white",
        "btn--color-gray": this.color === "gray",
        "btn--color-red": this.color === "red",
        "btn--color-default": this.color === "default",
        "btn--color-disabled": this.color === "disabled",
        "btn--color-transparent": this.color === "transparent",
        "btn--color-orange": this.color === "orange",
        "btn--color-yellow": this.color === "yellow",
        "btn--color-blue": this.color === "blue",
      };

      const outlineColorClasses = {
        "btn-outline--color-primary": this.color === "primary",
        "btn-outline--color-secondary": this.color === "secondary",
        "btn-outline--color-info": this.color === "info",
        "btn-outline--color-success": this.color === "success",
        "btn-outline--color-error": this.color === "error",
        "btn-outline--color-warning": this.color === "warning",
        "btn-outline--color-white": this.color === "white",
        "btn-outline--color-default": this.color === "default",
      };

      const otherClasses = {
        // Border-radius
        "btn--square": this.square,
        "btn--rouned": this.rounded,

        // Font weight
        "btn--normal": this.normal,

        // State
        "btn--loading": this.loading,

        // behavior
        "btn--text": !this.pointer
      };

      return {
        "btn--flat": this.flat,
        "btn-outline": this.outline,
        ...sizeClasses,
        ...(this.outline ? outlineColorClasses : colorClasses),
        ...otherClasses
      };
    }
  },

  render: function(h) {
    return h(
      this.nuxt ? "n-link" : this.tag,
      {
        props: {
          to: this.to,
          exact: this.exact
        },
        attrs: this.attrs,
        class: {
          btn: true,
          ...this.classes
        },
        on: this.$listeners
      },
      [
        this.loading &&
        h("div", {
          class: "btn__spin"
        },
          [
            h("app-spin", {
              props: {
                color: ['primary'].includes(this.color) && !this.outline ? 'white' : '',
                size:  "xs",
                type: this.loadingType
              }
            }),
          ]
        ),
        this.$slots.default
      ]
    );
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-button.scss";
</style>
