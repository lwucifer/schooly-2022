<template>
  <div class="elearning-manager-result__section">
    <div class="mark-section">
      <div class="row">
        <div class="col-md-6 mb-3">
          <div class="content-box-peer content-box-peer--solid student-profile h-100">
            <div class="d-flex align-items-center">
              <div class="mr-3">
                <app-avatar :src="studentAva" size="sm" alt="avatar" />
              </div>
              <div>
                <p class="mb-3"><span class="h4">{{ studentName }}</span></p>
                <p><span class="font-weight-normal">{{ className }}</span></p>
              </div>
            </div>
            <app-divider class="mt-15 mb-15"/>
            <div
              class="score"
              :class="{ 'score--pass': isPass, 'score--fail': (hasMark && !isPass), 'score--empty': !hasMark }"
            >
              <p class="score__num">{{ result }}</p>
              <p v-if="hasMark && !isPass && resultDesc" class="score__note">{{ resultDesc }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <div class="content-box-peer content-box-peer--solid h-100 description">
            <div class="row item">
              <div class="col-md-5 col-sm-4 label">
                Giờ bắt đầu làm bài
              </div>
              <div class="col-md-7 col-sm-8 value">
                <!--Thứ 4, 18 tháng 10 năm 2019, 11:00 AM-->
                <span v-if="startedAt">{{ startedAt | getDateTimeFullWeekDay | uppercaseFirst }}</span>
                <span v-else> {{ NOT_AVAILABLE_TXT }}</span>
              </div>
            </div>
            <div class="row item">
              <div class="col-md-5 col-sm-4 label">
                Giờ nộp bài
              </div>
              <div class="col-md-7 col-sm-8 value">
                <!--Thứ 4, 18 tháng 10 năm 2019, 11:00 AM-->
                <span v-if="finishedAt">{{ finishedAt | getDateTimeFullWeekDay | uppercaseFirst }}</span>
                <span v-else>{{ NOT_AVAILABLE_TXT }}</span>
              </div>
            </div>
            <div class="row item">
              <div class="col-md-5 col-sm-4 label">
                Thời gian làm bài
              </div>
              <div class="col-md-7 col-sm-8 value">
                <span v-if="duration">{{ duration | durationTime }}</span>
                <span v-else>{{ NOT_AVAILABLE_TXT }}</span>
              </div>
            </div>
            <div class="row item">
              <div class="col-md-5 col-sm-4 label">
                Tổng số câu hỏi
              </div>
              <div class="col-md-7 col-sm-8 value">
                {{ questionNum }}
              </div>
            </div>
            <div class="row item" v-if="correctAns">
              <div class="col-md-5 col-sm-4 label">
                Số đáp án đúng
              </div>
              <div class="col-md-7 col-sm-8 value">
                {{ correctAns }}
              </div>
            </div>
            <div class="row item">
              <div class="col-md-5 col-sm-4 label">
                Bỏ qua
              </div>
              <div class="col-md-7 col-sm-8 value">
                {{ ignoredQues }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <app-divider class="mt-3 mb-0"/>
    </div>
  </div>
</template>

<script>
  import { DATETIME_FULL_WEEK_DAY } from "~/utils/config";

  const NOT_AVAILABLE_TXT = "Không xác định"
  
  export default {
    components: {},
    props: {
      studentName: {
        type: String,
        required: true
      },
      studentAva: {
        type: String,
        required: true
      },
      className: {
        type: String,
        required: true
      },
      isPass: {
        type: Boolean,
        default: false
      },
      hasMark: {
        type: Boolean,
        default: true
      },
      result: {
        type: String,
        required: true
      },
      resultDesc: {
        type: String
      },
      startedAt: {
        type: String
      },
      finishedAt: {
        type: String
      },
      duration: {
        type: String|Number // second
      },
      questionNum: {
        type: String|Number,
        required: true
      },
      correctAns: {
        type: String|Number
      },
      ignoredQues: {
        type: String|Number,
        default: 0
      }
    },

    filters: {
      durationTime: function(val) {
        const h = Math.floor(val/60/60)
        const m = Math.floor((val - 60*60*h)/60)
        const s = val - 60*60*h - 60*m
        let str = ''
        if (h) {
          str += h + ' giờ '
        }
        if (m) {
          str += m + ' phút '
        }
        if (s) {
          str += s + ' giây'
        }
        return str
      }
    },
    data() {
      return {
        DATETIME_FULL_WEEK_DAY,
        NOT_AVAILABLE_TXT
      }
    }
  }
</script>

<style scoped>

</style>