<template>
  <span
    class="app-dropdown"
    :class="classes"
    z-index="0"
    v-on="listeners()"
    v-click-outside="handleClickOutside"
  >
    <slot name="activator" :on="{ click: openOnClick ? onClick : null }" />
    <div class="app-dropdown__content" :style="contentStyles">
      <slot />
    </div>
  </span>
</template>

<script>
export default {
  model: {
    prop: "active",
    event: "visible-change"
  },

  props: {
    active: Boolean,
    openOnClick: Boolean,
    contentWidth: {
      type: [String, Number],
      default: "" // css value
    },
    position: {
      type: String,
      default: "center" // left | center | rigjt
    }
  },

  data() {
    return {
      localActive: this.active
    };
  },

  computed: {
    classes() {
      return {
        // Type classes
        "app-dropdown-active": this.localActive,
        // Modifier classes
        "app-dropdown--left": this.position === "left",
        "app-dropdown--center": this.position === "center",
        "app-dropdown--right": this.position === "right",

        "app-dropdown--top-left": this.position === "topLeft",
        "app-dropdown--top-right": this.position === "topRight",
        "app-dropdown--top-center": this.position === "topCenter",

        "app-dropdown--bottom-left": this.position === "bottomLeft",
        "app-dropdown--bottom-right": this.position === "bottomRight",
        "app-dropdown--bottom-center": this.position === "bottomCenter",

        "app-dropdown--left-top": this.position === "leftTop",
        "app-dropdown--left-middle": this.position === "leftMiddle",
        "app-dropdown--left-bottom": this.position === "leftBottom",

        "app-dropdown--right-top": this.position === "rightTop",
        "app-dropdown--right-middle": this.position === "rightMiddle",
        "app-dropdown--right-bottom": this.position === "rightBottom"
      };
    },

    contentStyles() {
      if (!this.contentWidth) return;

      const isHasUnit = ["px", "rem", "%", "em"].findIndex(
        char => this.contentWidth.toString().indexOf(char) > -1
      );

      return {
        width: isHasUnit > -1 ? this.contentWidth : this.contentWidth + "px"
      };
    }
  },

  watch: {
    active(newValue) {
      this.localActive = newValue;
    }
  },

  methods: {
    onClick() {
      this.localActive = !this.localActive;
      this.$emit("visible-change", !this.active);
    },

    listeners() {
      const mouseenter = () => {
        this.localActive = true;
        this.$emit("visible-change", true);
      };

      const mouseleave = () => {
        this.localActive = false;
        this.$emit("visible-change", false);
      };

      const visibleEvents = !this.openOnClick ? { mouseenter, mouseleave } : {};

      return Object.assign({}, this.$listeners, visibleEvents);
    },

    handleClickOutside() {
      if (this.localActive) {
        this.localActive = false;
        this.$emit("visible-change", false);
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-dropdown.scss";
</style>
