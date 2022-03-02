<template>
  <div class="tooltip--submit-status-content">
    <p v-if="timestamp">Ngày nộp bài: <span>{{ timestamp }}</span></p>
    <p>Điểm: <span :class="statusCls">{{ scoreDetail }}</span></p>
  </div>
</template>

<script>
  import { get } from "lodash"
  import { SUBMISSION_RESULTS } from "~/utils/constants"

  export default {
    props: {
      timestamp: {
        type: String,
      },
      scoreDetail: {
        type: String | Number,
        required: true
      },
      result: {
        type: String,
        required: true
      }
    },
    
    filters: {
    },
    computed: {
      statusCls() {
        return {
          'text-primary': this.result === SUBMISSION_RESULTS.PASSED,
          'text-warning': this.result === SUBMISSION_RESULTS.PENDING ||
                          this.result === SUBMISSION_RESULTS.NONE,
          'text-pink-2': this.result === SUBMISSION_RESULTS.FAILED,
        }
      },
    },
    methods: {
      get
    }
  }
</script>

<style scoped lang="scss">
  .tooltip--submit-status-content {
    line-height: 2.2rem;
    font-size: 1.3rem;
  }
</style>