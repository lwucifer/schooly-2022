<template>
  <div class="form-schedule form-schedule-edit">
    <div class="row form-schedule__row mb-3">
      <div class="col-md-3">
        <label v-if="dataRowSchedule.assignment_type == 'CLASS'" class="form-schedule__label" for="textarea">Lớp:</label>
        <label v-if="dataRowSchedule.assignment_type == 'GROUP'" class="form-schedule__label" for="textarea">Nhóm học tập:</label>
        <label v-if="dataRowSchedule.assignment_type == 'ELEARNING'" class="form-schedule__label" for="textarea">Bài giảng/Khoá học:</label>
      </div>
      <div class="col-md-9">
       <a href>{{ dataRowSchedule.assignment_name }}</a>
      </div>
    </div>

    <div class="row form-schedule__row mb-3">
      <div class="col-md-3">
        <label class="form-schedule__label" for="textarea">Tên phòng học:</label>
      </div>
      <div class="col-md-9">
       <a href>{{ dataRowSchedule.online_class_name }}</a>
      </div>
    </div>
    
    <div class="row form-schedule__row mb-4">
      <div class="col-md-2">
        <label class="form-schedule__label" for="textarea">Nội dung</label>
      </div>

      <div class="col-md-10">
        <app-input class="mb-0" v-model="payload.note" textarea id="textarea" />
      </div>
    </div>

    <div class="row form-schedule__row mb-4">
      <div class="col-md-2">
        <label class="form-schedule__label">Buổi học của tôi</label>
      </div>

      <div class="col-md-10">
        <div class="form-schedule__fake-input">
          <a href
            >{{ getLocalTimeHH_MM_A(dataRowSchedule.start_time) }} -
            {{ getLocalTimeHH_MM_A(dataRowSchedule.end_time)
            }}{{ getDateBirthDay(dataRowSchedule.start_time) }}</a
          >
          - {{ dataRowSchedule.teacher_name_assigned }}
        </div>
      </div>
    </div>

    <div class="mb-4">
      <label class="form-schedule__label d-block mb-15"
        >Nội dung thay đổi</label
      >

      <div class="pl-4">
        <label class="form-schedule__label d-block body-2 mb-3">Giờ học</label>

        <div class="row form-schedule__row align-items-center mb-4">
          <div class="col-md-3">
            <label class="form-schedule__label form-schedule__label--gray"
              >Bắt đầu vào lúc</label
            >
          </div>

          <div class="col-md-9">
            <app-date-picker
              bordered
              class="mr-3"
              size="sm"
              valueFormat="HH:mm"
              placeholder="giờ:phút"
              type="time"
              :minuteStep="5"
              v-model="startTime"
              @input="changeSchedules"
            />
          </div>
        </div>

        <div class="row form-schedule__row align-items-center mb-4">
          <div class="col-md-3">
            <label class="form-schedule__label form-schedule__label--gray"
              >Thời lượng</label
            >
          </div>

          <div class="col-md-9">
            <app-date-picker
              bordered
              class="mr-3"
              size="sm"
              :minute-step="5"
              valueFormat="HH:mm"
              type="time"
              placeholder="giờ:phút"
              v-model="timeLimitHours"
              @input="handleDuration"
            />
          </div>
        </div>

        <div class="row form-schedule__row align-items-center mb-4">
          <div class="col-md-3">
            <label class="form-schedule__label body-2 mb-3">Thời gian</label>
          </div>

          <div class="col-md-9">
            <app-date-picker
              v-model="date"
              @input="handleDate"
              size="sm"
              placeholder="yyyy-mm-dd"
              valueFormat="YYYY-MM-DD"
            >
            </app-date-picker>
          </div>
        </div>
      </div>
    </div>

    <div class="row form-schedule__row-actions mt-5">
      <div class="col-md-10 offset-md-2">
        <app-button
          @click.prevent="$emit('close', '')"
          color="white"
          class="text-secondary"
          >Huỷ</app-button
        >
        <app-button @click.prevent="handleConfirm">Xác nhận</app-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";
import {
  getUTCDateTimeHH_MM_A,
  hoursToMinutes,
  getDateBirthDay,
  getLocalTimeHH_MM_A,
} from "~/utils/moment";
import moment from "moment";

export default {
  props: {
    dataRowSchedule: {
      type: Object,
      default: {},
    },
  },

  data() {
    return {
      startTime: "",
      timeLimitHours: 1,
      timeLimitHours: 1,
      date: null,
      payload: {
        note: "",
        type: "EDIT",
        lesson_id: "",
        edit_lesson: {
          start: "",
          duration: "",
          date: "",
        },
      },
    };
  },

  methods: {
    getDateBirthDay,
    getLocalTimeHH_MM_A,
    ...mapActions("elearning/teaching/olclass-modify-schedule", [
      "modifyScheduleAdd",
    ]),
    async handleConfirm() {
      console.log("handleConfirm");
      this.payload.lesson_id = this.dataRowSchedule.online_lesson_id;
      const that = this;
      if (that.payload.edit_lesson.start.lastIndexOf("PM" != -1)) {
        const indexOfCheck = that.payload.edit_lesson.start.lastIndexOf(" ");
        const checkData = that.payload.edit_lesson.start.slice(0, indexOfCheck);
        const date1 = Date.parse(`01/01/2020 ${checkData}`);
        const date2 = Date.parse("01/01/2020 5:00");
        if (date1 > date2) {
          that.payload.edit_lesson.date = moment(that.date)
            .subtract(1, "days")
            .format("YYYY-MM-DD");
        }
      }
      console.log("this.payload", this.payload);
      this.modifyScheduleAdd(this.payload).then(res => {
        console.log('res', res);
        if(res.success){
          this.$emit('addSucces', 'success')
        }
        else{
          this.$emit('addSucces', res.message)
        }
      })
    },

    changeSchedules(_value) {
      console.log("changeSchedules", this.startTime);
      this.payload.edit_lesson.start = getUTCDateTimeHH_MM_A(
        new Date("2020-01-01 " + _value)
      );
      console.log("this.payload.edit_lesson", this.payload.edit_lesson);
    },

    handleDuration(_value) {
      console.log("handleDuration", this.startTime);
      this.payload.edit_lesson.duration = hoursToMinutes(_value);
      console.log("this.payload.edit_lesson", this.payload.edit_lesson);
    },
    handleDate(_value){
      this.payload.edit_lesson.date = _value
    }
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/olclass/_form-schedule.scss";
</style>
