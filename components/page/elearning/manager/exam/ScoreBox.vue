<template>
  <div class="mark-score-box">
    <div class="text-center">
      <div
        style="min-width: 30rem; border: 1px solid #E0E0E0; mx-auto"
        class="font-weight-bold text-center d-inline-block py-4 px-4 mb-3"
        :class="{ 'score--pass': isPass, 'score--fail': isFailed, 'score--empty': isPending }"
      >
        <p v-if="isPass || isFailed || needScore" class="heading-1">{{ score }} Điểm</p>
        <p v-if="needStatus" class="heading-4">{{ status | getExerciseResultText }}</p>
      </div>
      <p v-if="desc" class="text-center caption text-gray-2">{{ desc }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    score: {
      type: String | Number
    },
    desc: {
      type: String,
    },
    status: {
      type: String // PASSED | FAILED | PENDING | NONE
    },
    needStatus: Boolean,
    needScore: Boolean
  },
  computed: {
    isPass() {
      return this.status == 'PASSED'
    },
    isPending() {
      return this.status == 'PENDING' || this.status == 'NONE'
    },
    isFailed() {
      return this.status == 'FAILED'
    }
  }
}
</script>
<style>
</style>