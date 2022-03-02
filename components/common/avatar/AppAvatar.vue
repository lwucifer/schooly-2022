<script>
export default {
  functional: true,

  props: {
    tag: {
      type: String,
      default: "span"
    },
    nuxt: Boolean,
    to: {
      type: [String, Object], // Vue-router prop. Denotes the target route of the link.
      default: ""
    },
    exact: {
      type: Boolean // Vue-router prop. Exactly match the link. Without this, '/' will match every route.
    },
    shape: {
      type: String,
      default: "circle" // circle | square,
    },
    size: {
      type: [String, Number],
      default: "default" // default | xs | sm | lg | css value
    },
    src: {
      type: String,
      default: ""
    },
    srcSet: {
      type: String
    },
    alt: {
      type: String
    },
    loadError: {
      type: Function,
      default: () => {}
    }
  },

  render(h, ctx) {
    return h(ctx.props.nuxt ? "n-link" : ctx.props.tag, {
      props: {
        to: ctx.props.to,
        exact: ctx.props.exact
      },
      attrs: ctx.attrs,
      class: [
        "app-avatar",
        ctx.data.class,
        ctx.data.staticClass,
        ctx.props.shape === "circle" && "app-avatar-circle",
        ctx.props.shape === "square" && "app-avatar-square",
        ctx.props.size === "xs" && "app-avatar--size-xs",
        ctx.props.size === "sm" && "app-avatar--size-sm",
        ctx.props.size === "lg" && "app-avatar--size-lg"
      ],
      style: {
        width: typeof ctx.props.size === "number" ? ctx.props.size + 'px' : ctx.props.size,
        height: typeof ctx.props.size === "number" ? ctx.props.size + 'px' : ctx.props.size,
      },
      on: ctx.$listeners
    },
    [h('img', {
      attrs: {
        src: ctx.props.src || require("~/assets/svg/images/default-avatar.svg?data"),
        srcset: ctx.props.srcSet,
        alt: ctx.props.alt,
      },
      on: {
        error: ctx.props.loadError
      }
    })]
    );
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-avatar.scss";
</style>