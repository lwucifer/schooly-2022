<template>
  <div class="create-action">
    <!-- <app-button
        class="create-action__btn create-action__btn-back"
        outline
        square
        nuxt
        to="./"
      >
        <IconArrowLeft class="icon mr-2" />
        Quay lại
    </app-button>-->

    <div
      class="create-action__right d-flex align-items-center"
      v-if="isShowAction"
    >
      <app-button
        outline
        class="mr-4"
        @click="$emit('handleReset')"
        square
        color="error"
        ><IconDelete class="mr-2" /> Thiết lập lại</app-button
      >

      <app-button class="mr-4" color="primary" square outline
        ><IconSave class="mr-2" /> Lưu nháp</app-button
      >

      <!-- <app-button
        class="create-action__btn"
        color="secondary"
        square
        @click="$emit('handleDelete')"
        >Xoá</app-button> -->

      <app-button
        @click="handleCLickSave"
        class="create-action__btn mr-4"
        square
        :disabled="!isSubmit"
        ><Forward class="mr-2" /> Lưu & Tiếp tục</app-button
      >
    </div>
  </div>
</template>

<script>
import IconArrowLeft from "~/assets/svg/design-icons/arrow-left.svg?inline";
import IconDelete from "~/assets/svg/v2-icons/delete_sweep_2.svg?inline";
import IconSave from "~/assets/svg/v2-icons/save_24px.svg?inline";
import Forward from "~/assets/svg/v2-icons/forward_2.svg?inline";
import { get } from "lodash";
import { mapState } from "vuex";

export default {
  components: {
    IconArrowLeft,
    IconDelete,
    IconSave,
    Forward,
  },

  computed: {
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
  },

  props: {
    isSubmit: {
      type: Boolean,
      default: true,
    },
    isShowAction: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    handleCLickSave() {
      if (this.disabled_all) return;
      this.$emit("handleCLickSave");
    },

    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_create-action.scss";
</style>
