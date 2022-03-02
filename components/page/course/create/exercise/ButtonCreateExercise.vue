<template>
  <div class="cc-panel__body pt-0">
    <!-- <app-alert type="warning" class="mb-4" show-close>
      <template slot="icon">
        <IconInfoCircle class="icon ce-alert-icon heading-3 fill-sub" />
      </template>
      Bạn có thể tạo bài kiểm tra bắt buộc cho bài giảng, khóa học của bạn tại
      đây. Học sinh cần hoàn thành bài kiểm tra và đạt điểm để hoàn thành khóa
      học.
    </app-alert> -->

    <app-button
      class="font-weight-semi-bold"
      color="primary"
      size="md"
      :disabled="disabled_all"
      @click="$emit('handleClick')"
      ><IconPlus2 class="mr-2" />{{ text }}</app-button
    >
  </div>
</template>

<script>
import IconInfoCircle from "~/assets/svg/design-icons/info-circle.svg?inline";
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import { get } from "lodash";
import { mapState } from "vuex";

export default {
  components: {
    IconInfoCircle,
    IconPlus2,
  },

  props: {
    category: {
      type: String,
      default: "",
    },
  },

  computed: {
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
    text() {
      return get(this, "category", "") === "TEST"
        ? "Tạo bài kiểm tra"
        : "Tạo bài tập";
    },
  },
};
</script>
