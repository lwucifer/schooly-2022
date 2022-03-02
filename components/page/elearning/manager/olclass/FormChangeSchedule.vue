<template>
  <div class="form-schedule form-schedule-change">
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

    <div class="row form-schedule__row mb-3">
      <div class="col-md-2">
        <label for="name" class="form-schedule__label">Buổi học của tôi</label>
      </div>

      <div class="col-md-10">
        <div class="form-schedule__fake-input">
          <a href
            >{{ getLocalTimeHH_MM_A(dataRowSchedule.start_time) }} -
            {{ getLocalTimeHH_MM_A(dataRowSchedule.end_time) }}
            {{ getDateBirthDay(dataRowSchedule.start_time) }}</a
          >
          - {{ dataRowSchedule.teacher_name_assigned }}
        </div>
      </div>
    </div>

    <div class="row form-schedule__row mb-3">
      <div class="col-md-10 offset-md-2">
        <IconBxTransfer class="icon d-block text-info heading-3 mx-auto" />
      </div>
    </div>

    <div class="row form-schedule__row mb-4">
      <div class="col-md-2">
        <label for="name" class="form-schedule__label">Buổi học cần đổi</label>
      </div>

      <div class="col-md-10">
        <app-select
          v-model="schedule"
          bordered
          class="w-100"
          :options="scheduleOpts"
          @change="handleChangeLesson"
        >
          <div slot="selected" slot-scope="{ selected }" v-if="schedule">
            <span class="text-primary"
              >{{ getLocalTimeHH_MM_A(selected.start_time) }} -
              {{ getLocalTimeHH_MM_A(selected.end_time) }}
              {{ getDateBirthDay(selected.start_time) }}</span
            >
            -
            {{ selected.teacher_name || "" }}
          </div>

          <div slot="option" slot-scope="{ option }">
            {{ option.name || "" }} -
            <span class="text-primary"
              >{{ getLocalTimeHH_MM_A(option.start_time) }} -
              {{ getLocalTimeHH_MM_A(option.end_time) }}
              {{ getDateBirthDay(option.start_time) }}</span
            >
            -
            {{ option.teacher_name || "" }}
          </div>
        </app-select>
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
import IconBxTransfer from "~/assets/svg/icons/bx-transfer.svg?inline";
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";
import { getDateBirthDay, getLocalTimeHH_MM_A } from "~/utils/moment";

export default {
  components: {
    IconBxTransfer,
  },

  props: {
    dataRowSchedule: {
      type: Object,
      default: {},
    },
  },

  data() {
    return {
      schedule: "",
      payload: {
        note: "",
        type: "CHANGE",
        lesson_id: "",
        change_lesson_id: "",
      },
    };
  },

  computed: {
    ...mapState("elearning/teaching/olclass", ["Lessons"]),
    scheduleOpts() {
      console.log("this.dataRowSchedule", this.dataRowSchedule);
      const tmp =
        (this.Lessons &&
          this.Lessons.data &&
          this.Lessons.data.content.map((item) => {
            return {
              ...item,
              value: item.lesson_id,
              text: "",
            };
          })) ||
        [];
      return tmp;
    },
  },

  async created() {
    console.log("this.Lessons", this.Lessons);
    const params = {
      page: 1,
      size: 999,
      sort: "start_time,desc",
      online_class_id: this.dataRowSchedule.online_class_id,
      is_owner: false,
      is_finished: false,
    };
    await this.$store.dispatch(
      `elearning/teaching/olclass/${actionTypes.TEACHING_OLCLASS_LESSONS.LIST}`,
      { params }
    );
    this.schedule =
      this.Lessons.data &&
      this.Lessons.data.content &&
      this.Lessons.data.content.length > 0 &&
      this.Lessons.data.content[0].lesson_id
        ? this.Lessons.data.content[0].lesson_id
        : "";
    this.payload.change_lesson_id = this.schedule;
    console.log("this.schedule", this.schedule);
  },

  methods: {
    getDateBirthDay,
    getLocalTimeHH_MM_A,
    ...mapActions("elearning/teaching/olclass-modify-schedule", ["modifyScheduleAdd"]),

    handleConfirm() {
      this.payload.lesson_id = this.dataRowSchedule.online_lesson_id,
      console.log("handleConfirm", this.payload);
      this.modifyScheduleAdd(this.payload).then(res => {
        console.log('res', res);
        if(res.success){
          this.$emit('addSucces', 'success')
        }
        else{
          this.$emit('addSucces', res.message)
        }
      });
    },

    handleChangeLesson(_value) {
      console.log("handleChangeLesson", _value);
      this.payload.change_lesson_id = _value;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/olclass/_form-schedule.scss";
</style>
