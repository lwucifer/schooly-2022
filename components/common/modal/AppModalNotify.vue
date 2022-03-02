<template>
  <app-modal
    v-bind="{ width, centered, order, visible }"
    :component-class="{ 'app-modal-notify': true }"
    :header="false"
    :footer="false"
    v-on="$listeners"
  >
    <div slot="content">
      <slot v-if="type !== 'default'" name="icon">
        <div class="app-modal-notify__icon">
          <IconCheckCircle v-if="type === 'success'" />
          <IconAlertTriangle v-if="type === 'warning'" />
          <IconAlertCircle v-if="type === 'error'" />
        </div>
      </slot>

      <slot v-if="title || $slots.title" name="title">
        <h3 class="app-modal-notify__title">{{ title }}</h3>
      </slot>

      <slot v-if="description || $slots.description" name="description">
        <div class="app-modal-notify__desc" :class="!centered ? 'text-left': ''">{{ description }}</div>
      </slot>

      <div class="app-modal-notify__actions">
        <slot name="actions" :confirmLoading="confirmLoading">
          <app-button
            class="font-weight-semi-bold"
            color="primary"
            :loading="confirmLoading"
            @click="$emit('ok')"
          >
            <slot name="okText">{{ okText }}</slot>
          </app-button>
        </slot>
      </div>

      <button class="app-modal-notify__close" @click="$emit('close')">
        <IconClose class="icon d-block fill-opacity-1" />
      </button>
    </div>
  </app-modal>
</template>

<script>
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline'";
import IconCheckCircle from "~/assets/svg/icons/check-circle-1.svg?inline";
import IconAlertTriangle from "~/assets/svg/icons/alert-triangle-1.svg?inline";
import IconAlertCircle from "~/assets/svg/icons/alert-circle-1.svg?inline";

export default {
  inheritAttrs: false,

  components: {
    IconClose,
    IconCheckCircle,
    IconAlertTriangle,
    IconAlertCircle
  },

  model: {
    prop: 'visible',
    event: 'visibleChange'
  },

  props: {
    // Pass to app-modal
    centered: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 1
    },
    width: {
      type: [Number, String],
      default: 536 // number in px or css value
    },
    visible: {
      type: Boolean,
      default: true
    },
    // This component props
    type: {
      type: String,
      default: "default",
      validator: value =>
        ["default", "success", "warning", "error"].includes(value)
    },
    title: {
      type: String,
      default: "Thông báo"
    },
    description: String,
    okText: {
      type: String,
      default: "Đóng"
    },
    confirmLoading: Boolean
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-modal-notify.scss";
</style>