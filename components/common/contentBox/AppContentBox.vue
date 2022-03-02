<script>
export default {
  props: {
    tag: {
      type: String,
      default: "div"
    },
    titleTag: {
      type: String,
      default: "h4"
    },
    nuxt: Boolean,
    to: {
      type: [String, Object] // Vue-router prop. Denotes the target route of the link.
    },
    exact: {
      type: Boolean // Vue-router prop. Exactly match the link. Without this, '/' will match every route.
    },
    direction: {
      type: String,
      default: "horizontal" // horizontal | vertical
    },
    size: {
      type: String,
      default: "" // sm | md
    },
    image: {
      type: String,
      default: "" // image source
    },
    title: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    metaFooter: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "",
      validator: value => ['', 'preview-link'].includes(value)
    }
  },

  computed: {
    classes() {
      const directionClasses = {
        "app-content-box--horizontal": this.direction === "horizontal",
        "app-content-box--vertical": this.direction === "vertical"
      };

      const sizeClasses = {
        "app-content-box--size-sm": this.size === "sm",
        "app-content-box--size-md": this.size === "md"
      };

      return {
        ...directionClasses,
        ...sizeClasses,
        'app-content-box--type-preview-link': this.type === 'preview-link'
      };
    }
  },

  render: function(h) {
    const contentBoxTitle =
      this.$slots.title || this.title
        ? h(
            this.titleTag,
            {
              class: "app-content-box__title"
            },
            [this.$slots.title ? this.$slots.title : this.title]
          )
        : null;

    const contentBoxDesc =
      this.$slots.desc || this.desc
        ? h(
            "p",
            {
              class: "app-content-box__desc"
            },
            [this.$slots.desc ? this.$slots.desc : this.desc]
          )
        : null;

    const contentBoxMetaFooter =
      this.$slots["meta-footer"] || this.metaFooter
        ? h(
            "div",
            {
              class: "app-content-box__meta-footer"
            },
            [
              [
                this.$slots["meta-footer"]
                  ? this.$slots["meta-footer"]
                  : this.metaFooter
              ]
            ]
          )
        : null;

    return h(
      this.nuxt ? "n-link" : this.tag,
      {
        props: {
          to: this.to,
          exact: this.exact
        },
        attrs: this.attrs,
        class: {
          "app-content-box": true,
          ...this.classes
        },
        on: this.$listeners
      },
      [
        this.image &&
          h(
            "div",
            {
              class: "app-content-box__image"
            },
            [
              h("img", {
                attrs: { src: this.image ? this.image : null },
                slot: "image"
              })
            ]
          ),

        h(
          "div",
          {
            class: "app-content-box__meta"
          },
          [contentBoxTitle, contentBoxDesc, contentBoxMetaFooter]
        )
      ]
    );
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-content-box.scss";
</style>