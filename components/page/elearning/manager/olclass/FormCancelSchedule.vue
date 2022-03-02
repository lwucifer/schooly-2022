<template>
  <div class="form-schedule form-schedule-cancel">
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
        <app-input class="mb-0" textarea id="textarea" v-model="payload.note" />
      </div>
    </div>

    <div class="row form-schedule__row mb-4">
      <div class="col-md-2">
        <label for="name" class="form-schedule__label">Buổi học của tôi</label>
      </div>

      <div class="col-md-10">
        <div class="form-schedule__fake-input">
          <a href=""
            >{{ getLocalTimeHH_MM_A(dataRowSchedule.start_time) }} -
            {{ getLocalTimeHH_MM_A(dataRowSchedule.end_time)
            }}{{ getDateBirthDay(dataRowSchedule.start_time) }}</a
          >
          - {{ dataRowSchedule.teacher_name_assigned }}
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
import { getDateBirthDay, getLocalTimeHH_MM_A } from "~/utils/moment";
export default {
  props: {
    dataRowSchedule: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      payload: {
        note: "",
        type: "CANCEL",
        lesson_id: "",
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
      this.payload.lesson_id = this.dataRowSchedule.online_lesson_id;
      this.modifyScheduleAdd(this.payload).then((res) => {
        console.log("res", res);
        if (res.success) {
          this.$emit("addSucces", "success");
        } else {
          this.$emit("addSucces", res.message);
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/olclass/_form-schedule.scss";
</style>
