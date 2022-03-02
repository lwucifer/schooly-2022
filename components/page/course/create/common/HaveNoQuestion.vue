<template>
  <div class="my-4">
    <div>
      <div class="d-flex align-items-center justify-content-center">
        <img src="~/assets/images/elearning/exam-no-question.png" alt="a" />
      </div>
    </div>
    <p class="text-center title mb-4 pb-2">
      <span>Bạn chưa tạo câu hỏi nào.</span>
    </p>
    <p class="text-warning py-2 d-flex align-items-center justify-content-center">
      <IconWarning />&nbsp;
      {{ subTitle }}
    </p>
    <!-- <div class="text-center">
      <app-button
        class="font-weight-semi-bold"
        size="md"
        color="white"
        style="min-width: 9.72rem; margin-right: 1.2rem;"
      >
        Hủy
      </app-button>
      <app-button
        class="font-weight-semi-bold"
        size="md"
        style="min-width: 9.72rem;"
      >
        Hoàn thành
      </app-button>
    </div>-->
  </div>
</template>

<script>
import IconWarning from "~/assets/svg/v2-icons/error_outline_24px.svg?inline";

export default {
  components: {
    IconWarning
  },
  props: {
    subTitle: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
</style>