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
    <!--Table-->
    <result-table-section
      class="py-3"
      :contents="submissionContent"
    />
    
    <!--Form-->
    <mark-form-section
      class="mt-4"
      v-if="isFailed"
      :remain-work="get(this, 'detail.remain_works', 0)"
      @submit="handleMark"
    />
    
    <app-modal-confirm
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      title="Bạn muốn chấm điểm?"
      description="Bạn sẽ không thể thay đổi được kết quả sau khi đã chấm điểm"
      ok-text="Xác nhận"
      @ok="confirmMark"
      @cancel="cancelMark"
      centered
    >
    </app-modal-confirm>
    
    <app-modal-notify
      v-if="showModalError"
      type="warning"
      title="Chấm điểm thất bại!"
      description="Có lỗi xảy ra, vui lòng thử lại."
      @ok="showModalError = false"
      @close="showModalError = false"
      centered
    >
      <template v-slot:icon>
      
      </template>
    </app-modal-notify>
  
  </div>
</template>

<script>
  import MarkSection from "~/components/page/elearning/mytutor/exam/Mark"
  import MarkFormSection from "~/components/page/elearning/mytutor/exam/forms/ChoiceMark"
  import ResultTableSection from "~/components/page/elearning/mytutor/exam/tables/ChoiceResult"
  import {mapState} from "vuex"
  import {subResult2Txt} from "~/plugins/filters"
  import * as actionTypes from "~/utils/action-types"
  import {get} from "lodash"
  import {SUBMISSION_RESULTS} from "~/utils/constants"
  import {getParamQuery} from "~/utils/common"
  import {createPayloadAddEvaluation} from "~/models/elearning/Evaluation"
  
  const STORE_NAMESPACE = 'elearning/teaching/evaluation'
  
  export default {
    layout: "manage",
    
    components: {
      MarkSection,
      MarkFormSection,
      ResultTableSection,
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
      };
    },
    computed: {
      ...mapState("auth", ["loggedUser"]),
      isPass: function () {
        return get(this, 'detail.result', false) &&
          (get(this, 'detail.result', SUBMISSION_RESULTS.FAILED) == SUBMISSION_RESULTS.PASSED)
      },
      isPending: function () {
        return get(this, 'detail.result', false) &&
          (get(this, 'detail.result', SUBMISSION_RESULTS.FAILED) == SUBMISSION_RESULTS.PENDING)
      },
      isFailed: function () {
        return get(this, 'detail.result') == SUBMISSION_RESULTS.FAILED
      },
      hasMark: function () {
        return get(this, 'detail.result', false) &&
          (get(this, 'detail.result', '') != SUBMISSION_RESULTS.PENDING)
      },
      result: function () {
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
      submissionContent: function () {
        return get(this, 'detail.answers', [])
      }
    },
    methods: {
      handleMark(content) {
        this.payload = {...this.payload, ...content}
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
  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/elearning/_elearning-result.scss";
  @import "~/assets/scss/components/elearning/_elearning-objective-test-table.scss";
</style>
