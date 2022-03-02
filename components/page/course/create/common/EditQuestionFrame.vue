<template>
  <div class="edit-question-frame">
    <slot />
    <div class="edq__action-btns">
      <div class="d-flex justify-content-end mt-4 mb-0">
        <app-button
          color="white"
          class="font-weight-semi-bold mr-4 text-secondary bg-white"
          size="md"
          @click="$emit('cancel')"
          >Huỷ</app-button
        >
        <app-button
          color="primary"
          class="font-weight-semi-bold"
          size="md"
          @click="$emit('submit')"
          >Lưu</app-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  }
}
</script>
<style lang="scss">
@import "~assets/scss/components/course/create/_edit-question.scss";
</style>