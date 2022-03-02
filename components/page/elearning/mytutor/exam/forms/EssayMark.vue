<template>
  <div class="writting-test-score">
    <div class="writting-test-score__form">
      <div class="item" v-if="pending || (canPass && failed)">
        <label for="" class="content-title">Nhận xét chi tiết bài làm của học sinh</label>
        <app-editor id="comment" v-model="$v.formData.note.$model"/>
      </div>
      <div class="item" v-if="pending">
        <label for="" class="content-title" style="font-size: 1.5rem;">Chấm điểm bài tập tự luận</label>
        <point-choice
          :score-to-pass="scoreToPass"
          :scale-score="scaleScore"
          :additional-score="additionalScore"
          :max-availble="essayMax"
          @changedPoint="updatePoint"
        >
        </point-choice>
      </div>
      
      <div class="item mt-4" title="Học sinh cần phải hết lượt làm bài để có thể cho qua" v-if="canPass && failed">
        <app-checkbox
          v-model="$v.formData.to_passed.$model"
          label="Cho qua"
          style="color: #333;"
          :disabled="(formData.mark != '' && formData.mark != null && failed == false) || (!canPass)"
          :class="{ 'disabled': formData.mark != '' && formData.mark != null, 'app-input--error': get($v, 'formData.to_passed.$error', true) }"
        >
        </app-checkbox>
        <p class="form--note">
          <i>*Học sinh này đã vượt quá số lần làm bài cho phép. Bạn có đồng ý cho phép học sinh này hoàn thành bài tập với số điểm tối thiểu?</i>
        </p>
      </div>

      <div class="item text-center" v-if="pending || (failed && canPass)">
        <!-- <app-button
          normal
          @click="submit"
          :disabled="$v.$invalid"
        >
          Xác nhận
        </app-button> -->
        <app-button
          normal
          @click="submit"
        >
          Xác nhận
        </app-button>
      </div>
    </div>
  
    <app-modal-notify
      v-if="visible.error"
      type="warning"
      :title="visible.title"
      :description="notiMes"
      @ok="visible.error = false"
      @close="visible.error = false"
      centered
    >
    </app-modal-notify>
  </div>
</template>

<script>
  import PointChoice from "~/components/page/elearning/mytutor/exam/forms/PointChoice"
  
  import {
    required,
    requiredIf,
    minLength,
    maxLength,
    numeric,
    decimal,
    maxValue,
    minValue,
    between,
  } from "vuelidate/lib/validators"
  import { get } from "lodash"

  import { APP_INPUT_VALIDATE_STATUS } from "~/utils/constants"

  export default {
    components: {
      PointChoice
    },
    props: {
      remainWork: {
        type: String | Number,
        default: 0,
      },
      pending: {
        type: Boolean
      },
      failed: {
        type: Boolean
      },
      scoreToPass: {
        type: Number | String,
        required: true
      },
      scaleScore: {
        type: Number | String,
        required: true
      },
      additionalScore: {
        type: Number | String,
        default: 0
      },
      essayMax: {
        type: String | Number,
        default: 10
      },
      note: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        isPass: null,
        VALIDATE_STATUS_CODE: Object.freeze(APP_INPUT_VALIDATE_STATUS),
        formData: {
          mark: '',
          note: null,
          to_passed: false
        },
        visible: {
          error: false,
          title: 'Chấm điểm thất bại!'
        },
        notiMes: ''
      }
    },
    validations: {
      formData: {
        mark: {
          required: requiredIf(function (model) {
            return (!model.to_passed) && (model.mark == '' || model.mark == null)
          }),
          decimal,
          maxValue: maxValue(10),
          minValue: minValue(0),
          between: between(0.0, 10.0)
        },
        note: {
          required,
          minLength: minLength(8),
          // maxLength: maxLength(500)
        },
        to_passed: {
          required: requiredIf(function (model) {
            return (!model.to_passed) && (model.mark == '' || model.mark == null)
          }),
        }
      }
    },
    watch: {
    
    },
    computed: {
      canPass() {
        return this.remainWork <= 0
      }
    },
    methods: {
      submit() {
        if (this.$v.$invalid) {
          if (!this.$v.formData.mark.required) {
            this.notiMes = 'Vui lòng chọn số điểm'
          } else if (!this.$v.formData.note.required) {
            this.notiMes = 'Vui lòng nhập nhận xét'
          }
          this.$nextTick(() => {
            this.visible.error = true
          })
        } else {
          this.$emit('submit', this.formData)
        }
      },
      getValidationCode(input) {
        if (get(this.$v, `${input}.$error`)) {
          return this.VALIDATE_STATUS_CODE.ERROR
        }
        return this.VALIDATE_STATUS_CODE.DEFAULT
      },
      updatePoint(point) {
        this.formData.mark = point
        this.formData.to_passed = false
      },
      resetForm() {
        this.formData.mark = ''
        this.formData.note = ''
        this.formData.to_passed = false
      },
      initData() {
        this.formData.note = this.note;
      },
      get
    },
    created() {
      this.initData();
    }
  }
</script>

<style lang="scss">
  .app-checkbox.disabled {
    .app-checkbox__checkmark {
      background-color: #eee;
    }
  }
</style>