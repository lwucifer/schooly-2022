<template>
  <div v-if="visible">
    <portal to="modal" :order="order">
      <div class="app-modal-root">
        <div class="app-modal-overlay"></div>
        <div
          v-bind="$attrs"
          v-scroll-lock="true"
          class="app-modal-wrapper"
          tabindex="-1"
          role="dialog"
          :class="{...classes, ...componentClass}"
          @click.self="$emit('close')"
        >
          <div
            class="app-modal"
            role="document"
            :style="{
              width: typeof width === 'number' ? width + 'px' : width,
              maxWidth: typeof maxWidth === 'number' ? maxWidth + 'px' : maxWidth,
            }"
          >
            <div class="app-modal-components" :class="{ 'background-transparent' : backgroundTransparent}">
              <div v-if="header" class="app-modal-header">
                <slot name="header" :close="close">
                  <div class="d-flex align-items-center justify-content-between">
                    <h4 class="app-modal-title">{{ title }}</h4>
                    <button class="app-modal-close" @click="close">
                      <IconClose class="icon d-block fill-opacity-1" />
                    </button>
                  </div>
                </slot>
              </div>

              <div class="app-modal-content">
                <slot name="content"></slot>
              </div>

              <div v-if="footer" class="app-modal-footer">
                <slot name="footer">
                  <div class="d-flex justify-content-end">
                    <app-button
                      class="mr-3"
                      color="default"
                      outline
                      :loading="cancelLoading"
                      :size="size"
                      @click="cancel"
                    >
                      <slot name="cancelText">{{ cancelText }}</slot>
                    </app-button>

                    <app-button :loading="confirmLoading" :size="size" @click="ok">
                      <slot name="okText">{{ okText }}</slot>
                    </app-button>
                  </div>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </portal>
  </div>
</template>

<script>
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";

export default {
  inheritAttrs: false,

  components: {
    IconClose
  },

  model: {
    prop: "visible",
    event: "visibleChange"
  },

  props: {
    width: {
      type: [Number, String],
      default: 600 // number in px or css value
    },
    maxWidth: {
      type: [Number, String]
    },
    size: {
      type: String,
      default: "md",
      validator: value => ["sm", "md"].indexOf(value) > -1
    },
    componentClass: {
      type: Object,
      default: () => ({})
    },
    order: {
      type: Number,
      default: 1
    },
    centered: Boolean,
    visible: {
      type: Boolean,
      default: true
    },
    title: String,
    confirmLoading: Boolean,
    cancelLoading: Boolean,
    footer: {
      type: Boolean,
      default: true
    },
    header: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: "Đóng"
    },
    okText: {
      type: String,
      default: "Lưu thay đổi"
    },
    backgroundTransparent: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    classes() {
      return {
        "app-modal--centered": this.centered,
        "app-modal--size-md": this.size === "md",
        "app-modal--size-sm": this.size === "sm"
      };
    }
  },

  created() {
    if (process.browser) {
      window.addEventListener("keyup", this.closeByEscape);
    }
  },

  beforeDestroy() {
    window.removeEventListener("keyup", this.closeByEscape);
  },

  methods: {
    close() {
      this.$emit("close");
    },

    ok() {
      this.$emit("ok");
    },

    cancel() {
      this.$emit("cancel");
    },

    closeByEscape(event) {
      if (event.key === "Esc" || event.key === "Escape") {
        this.close();
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-modal.scss";
</style>