<template>
  <app-modal
    v-bind="{ width, centered, order, visible }"
    :component-class="{
      'app-modal-confirm': true,
      'app-modal-confirm--default': type === 'default' 
    }"
    :header="false"
    :footer="false" 
    v-on="$listeners"
  >
<!-- @close="$emit('cancel')" -->
    <div slot="content">
      <slot v-if="type !== 'default'" name="icon">
        <div class="app-modal-confirm__icon">
          <IconCheckCircle v-if="type === 'success'" />
          <IconAlertTriangle v-if="type === 'warning'" />
          <IconAlertCircle v-if="type === 'error'" />
        </div>
      </slot>

      <slot v-if="title || $slots.title" name="title">
        <h3 class="app-modal-confirm__title">{{ title }}</h3>
      </slot>

      <slot v-if="description || $slots.description" name="description">
        <div class="app-modal-confirm__desc">{{ description }}</div>
      </slot>

      <div class="app-modal-confirm__actions">
        <slot name="actions" :confirmLoading="confirmLoading">
          <app-button
            class="font-weight-semi-bold mr-3"
            color="default"
            outline
            @click="$emit('cancel')"
          >
            <slot name="cancelText">{{ cancelText }}</slot>
          </app-button>

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

      <button class="app-modal-confirm__close" @click="$emit('cancel')">
        <IconClose class="icon d-block fill-opacity-1" />
      </button>
    </div>
  </app-modal>
</template>

<script>
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconCheckCircle from "~/assets/svg/icons/check-circle-1.svg?inline";
import IconAlertTriangle from "~/assets/svg/icons/alert-triangle-1.svg?inline";
import IconAlertCircle from "~/assets/svg/icons/alert-circle-1.svg?inline";

export default {
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
    centered: Boolean,
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
      default: "Xác nhận?"
    },
    description: String,
    okText: {
      type: String,
      default: "Xác nhận"
    },
    cancelText: {
      type: String,
      default: "Huỷ"
    },
    confirmLoading: Boolean
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-modal-confirm.scss";
</style>
