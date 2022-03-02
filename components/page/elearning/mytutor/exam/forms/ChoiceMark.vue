<template>
  <div class="">
    <div
      class="form--score"
      title="Học sinh cần phải hết lượt làm bài để có thể cho qua"
      v-if="canPass"
    >
      <app-checkbox
        v-model="formData.to_passed"
        label="Cho qua"
        :disabled="!canPass"
      >
      </app-checkbox>
      <p class="form--note">
        <i>*Học sinh này đã vượt quá số lần làm bài cho phép. Bạn có đồng ý cho phép học sinh này hoàn thành bài tập với số điểm tối thiểu?</i>
      </p>
    </div>

    <div
      class="mt-4 text-center"
    >
      <app-button
        v-if="canPass"
        normal
        :disabled="(!formData.to_passed) || !canPass"
        :color="(formData.to_passed && canPass) ? 'primary' : 'disabled'"
        @click="submit"
      >
        Xác nhận
      </app-button>
    </div>
  </div>
</template>

<script>

  export default {
    components: {

    },
    data() {
      return {
        formData: {
          to_passed: false
        },
      }
    },
    props: {
      remainWork: {
        type: String | Number,
        default: 0,
      }
    },
    watch: {
      filters: {
      }
    },
    methods: {
      submit() {
        this.$emit('submit', this.formData)
      },
      resetForm() {
        this.formData.to_passed = false
      },
    },
    computed: {
      canPass() {
        return this.remainWork <= 0
      }
    }
  }
</script>

<style scoped>

</style>