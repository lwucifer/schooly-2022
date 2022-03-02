<template>
  <div>
    <div class="row mb-5">
      <div class="col-md-6">
        <h5 class="h-100 d-flex align-items-center mb-4">Nhập số lượng câu hỏi của đề thi bạn vừa tải lên:</h5>
      </div>
      <div class="col-md-6">
        <div class="d-flex h-100 align-items-center">
          <div class="d-flex align-items-center mr-5">
            <span class="mr-3">Câu hỏi trắc nghiệm</span>
            <app-input
              class="mb-0"
              type="number"
              style="max-width:6rem"
            />
          </div>
          <div class="d-flex align-items-center">
            <span class="mr-3">Câu hỏi tự luận</span>
            <app-input
              class="mb-0"
              type="number"
              style="max-width:6rem"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Action button group -->
    <div class="text-center">
      <app-button class="mr-4 px-5 text-secondary" color="white" @click="cancel">
        Hủy
      </app-button>
      <app-button @click="submit" class="px-4">
        Xác nhận
      </app-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {

    };
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    submit() {
      this.$emit('submitted');
    }
  }
}
</script>
<style lang="scss">

</style>