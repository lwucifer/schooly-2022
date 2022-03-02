<template>
  <div class="elearning-manager-result">
    <mark-section
      :student-name="get(this, 'detail.name', '')"
      :student-ava="get(this, 'detail.avatar.low', '')"
      :class-name="get(this, 'detail.class_name', '')"
      :is-pass="isPass"
      :result="result"
      :result-desc="resultDesc"
      :started-at="get(this, 'detail.start_time', '')"
      :finished-at="get(this, 'detail.timestamp', '')"
      :duration="get(this, 'detail.duration', 0)"
      :question-num="get(this, 'detail.questions', 0)"
      :correct-ans="get(this, 'detail.corrects', 0)"
      :ignored-ques="get(this, 'detail.ignores', 0)"
      :has-mark="hasMark"
    />

    <essay-submission-content
      :contents="submissionContent"
      :note="note"
    />
    <!--form-->
    <mark-form-section
      ref="markForm"
      v-if="isPending || isFail"
      :score-to-pass="get(this, 'detail.pass_score', 5)"
      :scale-score="get(this, 'detail.points', 10)"
      :pending="isPending"
      :failed="isFail"
      :note="note"
      :remain-work="get(this, 'detail.remain_works', 0)"
      @submit="handleMark"
    />
  
    <app-modal-confirm
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      title="Bạn muốn chấm điểm?"
      description="Bạn sẽ không thể thay đổi được kết quả sau khi đã chấm điểm"
      ok-text="Xác nhận"
      centered
      @ok="confirmMark"
      @cancel="cancelMark"
    >
    </app-modal-confirm>
  
    <app-modal-notify
      v-if="showModalError"
      type="warning"
      title="Chấm điểm thất bại!"
      description="Có lỗi xảy ra, vui lòng thử lại."
      @ok="showModalError = false"
      @close="showModalError = false"
      centered2
    >
      <template v-slot:icon>
    
      </template>
    </app-modal-notify>
  </div>
</template>

<script>
  import MarkSection from "~/components/page/elearning/manager/exam/Mark"
  import MarkFormSection from "~/components/page/elearning/manager/exam/forms/EssayMark"
  import EssaySubmissionContent from "~/components/page/elearning/manager/exam/EssaySubmissionContent"
  import { mapState, mapGetters } from "vuex"
  import * as actionTypes from "~/utils/action-types"
  import { get } from "lodash"
  import { SUBMISSION_RESULTS } from "~/utils/constants"
  import { createPayloadAddEvaluation } from "~/models/elearning/Evaluation"
  import { subResult2Txt } from "~/plugins/filters"
  import { getParamQuery } from "~/utils/common"

  const STORE_NAMESPACE = 'elearning/teaching/evaluation'
  const QUESTION_CREATING_STORE = "elearning/teaching/result"

  export default {
    layout: "manage",
    
    components: {
      MarkSection,
      MarkFormSection,
      EssaySubmissionContent,
    },
    props: {
      detail: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        showModalConfirm: false,
        showModalError: false,
        confirmLoading: false,
        payload: {
          test_id: this.$route.params.id,
          user_id: this.getParamQuery('user_id')
        }
      }
    },
    computed: {
      ...mapGetters(QUESTION_CREATING_STORE, {
        essayQuestions: 'essayQuestionsOfSubmission',
      }),
      isFail: function() {
        return get(this, 'detail.result', false) &&
          (get(this, 'detail.result', SUBMISSION_RESULTS.PASSED) == SUBMISSION_RESULTS.FAILED)
      },
      isPass: function() {
        return get(this, 'detail.result', false) &&
          (get(this, 'detail.result', SUBMISSION_RESULTS.FAILED) == SUBMISSION_RESULTS.PASSED)
      },
      isPending: function() {
        return get(this, 'detail.result', false) &&
          (get(this, 'detail.result', SUBMISSION_RESULTS.FAILED) == SUBMISSION_RESULTS.PENDING)
      },
      hasMark: function() {
        return get(this, 'detail.result', false) &&
          (get(this, 'detail.result', '') != SUBMISSION_RESULTS.PENDING)
      },
      result: function() {
        if (
          get(this, 'detail.result', false) &&
          get(this, 'detail.result') == SUBMISSION_RESULTS.PENDING
        ) {
          return subResult2Txt(SUBMISSION_RESULTS.PENDING)
        } else {
          if (this.isPass) {
            return `${get(this, 'detail.mark', 0)}/${get(this, 'detail.points', 0)} (${subResult2Txt(SUBMISSION_RESULTS.PASSED)})`
          } else {
            return `${get(this, 'detail.mark', 0)}/${get(this, 'detail.points', 0)} (${subResult2Txt(SUBMISSION_RESULTS.FAILED)})`
          }
        }
      },
      resultDesc() {
        return `Số lần làm bài còn lại: ${get(this, 'detail.remain_works', 0)}`
      },
      submissionContent: function() {
        return get(this, 'detail.answers', [])
      },
      note: function() {
        return get(this, 'detail.note', null)
      }
    },

    methods: {
      handleMark(content) {
        this.payload = { ...this.payload, ...content }
        this.showModalConfirm = true
      },
      async confirmMark() {
        this.confirmLoading = true
        await this.mark()
        this.confirmLoading = false
        this.showModalConfirm = false
      },
      cancelMark() {
        this.showModalConfirm = false
      },
      async mark() {
        const payload = createPayloadAddEvaluation(this.payload)
        const res = await this.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_EVALUATION.ADD}`,
          payload
        )
        if (get(res, "success", false)) {
          this.$refs['markForm'].resetForm()
          this.$emit("refreshSubmission")
          this.$toasted.success(
            get(res, "message", "")
          );
          return
        }
        this.showModalError = true
      },
      get,
      getParamQuery
    },
    created() { 
    }
  };
</script>

<style lang="scss">
  @import "~/assets/scss/components/elearning/_elearning-result.scss";
  @import "~/assets/scss/components/elearning/_elearning-writing-test-result.scss";
</style>