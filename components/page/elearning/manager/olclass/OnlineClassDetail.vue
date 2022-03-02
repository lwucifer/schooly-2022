<template>
  <div class="online-class-detail">
    <div class="mb-4">
      <h4 class="online-class-detail__heading">Nội dung</h4>
      <div class="online-class-detail__content">
        {{ scheduleListDetail && scheduleListDetail.note }}
      </div>
    </div>

    <!-- <div class="mb-4">
      <h4 class="online-class-detail__heading">Giờ học</h4>

      <div class="row align-items-center mb-4">
        <div class="col-md-3">
          <span class="online-class-detail__time-title">Bắt đầu vào lúc</span>
        </div>

        <div class="col-md-9">
          <app-date-picker
            class="ml-3"
            square
            size="sm"
            placeholder="yyyy-mm-dd"
            valueFormat="YYYY-MM-DD"
          ></app-date-picker>
        </div>
      </div>

      <div class="row align-items-center">
        <div class="col-md-3">
          <span class="online-class-detail__time-title">Thời lượng</span>
        </div>

        <div class="col-md-9">
          <app-date-picker
            class="ml-3"
            square
            size="sm"
            placeholder="yyyy-mm-dd"
            valueFormat="YYYY-MM-DD"
          ></app-date-picker>
        </div>
      </div>
    </div> -->

    <!-- <div class="mb-4">
      <h4 class="online-class-detail__heading">Ngày trong tuần</h4>

      <div class="row flex-wrap">
        <div v-for="(day, index) in DAYS" :key="index" class="col-auto mb-3">
          <app-checkbox :value="index" :checked="daysChecked.includes(index)">{{ day }}</app-checkbox>
        </div>
      </div>
    </div> -->

    <!-- <div class="mb-4">
      <h4 class="online-class-detail__heading">Thời gian áp dụng</h4>

      <div class="d-flex-center">
        <div class="d-flex-center mr-4">
          <label>Từ</label>
          <app-date-picker
            class="ml-3"
            square
            size="sm"
            placeholder="yyyy-mm-dd"
            valueFormat="YYYY-MM-DD"
          ></app-date-picker>
        </div>
        <div class="d-flex-center">
          <label>Đến</label>
          <app-date-picker
            class="ml-3"
            square
            size="sm"
            placeholder="yyyy-mm-dd"
            valueFormat="YYYY-MM-DD"
          ></app-date-picker>
        </div>
      </div>
    </div> -->

    <div class="mb-4" v-if="scheduleListDetail.type != 'CANCEL'">
      <h4 class="online-class-detail__heading">Buổi học</h4>

      <div class="online-class-detail__swap">
        <div class="online-class-detail__swap-item">
          <div>
            {{
              scheduleListDetail.lesson && scheduleListDetail.lesson.lesson_name
                ? scheduleListDetail.lesson.lesson_name
                : ""
            }}
          </div>
          <div class="text-primary">
            {{ convertStart(scheduleListDetail.lesson && scheduleListDetail.lesson.start) }} -
            {{ convertStart(scheduleListDetail.lesson && scheduleListDetail.lesson.end) }} -
            {{
              getDateBirthDay(
                scheduleListDetail.lesson && scheduleListDetail.lesson.date
              )
            }}
          </div>
          <div>
            {{
              (scheduleListDetail.lesson &&
                scheduleListDetail.lesson.teacher) ||
                ""
            }}
          </div>
        </div>

        <div class="online-class-detail__swap-icon" v-if="scheduleListDetail.type == 'CHANGE'">
          <IconBxTransfer class="icon fill-opacity-1" />
          <IconArrowRightAlt24px v-if="scheduleListDetail.type == 'EDIT'" class="icon" />
        </div>

        <div class="online-class-detail__swap-icon-right" v-if="scheduleListDetail.type == 'EDIT'">
          <IconArrowRightAlt24px class="icon fill-opacity-1" />
        </div>

        <div class="online-class-detail__swap-item">
          <div v-if="scheduleListDetail.type == 'EDIT'">
            {{
              scheduleListDetail.lesson && scheduleListDetail.lesson.lesson_name
                ? scheduleListDetail.lesson.lesson_name
                : ""
            }}
          </div>
          <div v-if="scheduleListDetail.type == 'CHANGE'">
            {{
              scheduleListDetail.change_lesson &&
              scheduleListDetail.change_lesson.lesson_name
                ? scheduleListDetail.change_lesson.lesson_name
                : ""
            }}
          </div>
          <div class="text-primary" v-if="scheduleListDetail.type == 'CHANGE'">
            {{ convertStart(scheduleListDetail.change_lesson && scheduleListDetail.change_lesson.start) }} -
            {{ convertStart(scheduleListDetail.change_lesson && scheduleListDetail.change_lesson.end) }} -
            {{
              getDateBirthDay(
                scheduleListDetail.change_lesson && scheduleListDetail.change_lesson.date
              )
            }}
          </div>
          <div class="text-primary" v-if="scheduleListDetail.type == 'EDIT'">
            {{ convertStart(scheduleListDetail.edit && scheduleListDetail.edit.start) }} -
            {{ convertStart(scheduleListDetail.edit && scheduleListDetail.edit.end) }} -
            {{
              getDateBirthDay(
                scheduleListDetail.edit && scheduleListDetail.edit.date
              )
            }}
          </div>
          <div v-if="scheduleListDetail.type == 'EDIT'">
            {{
              (scheduleListDetail.lesson &&
                scheduleListDetail.lesson.teacher) ||
                ""
            }}
          </div>
          <div v-if="scheduleListDetail.type == 'CHANGE'">
            {{
              (scheduleListDetail.change_lesson &&
                scheduleListDetail.change_lesson.teacher) ||
                ""
            }}
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-5">
      <app-button @click.prevent="$emit('close', '')">Đóng</app-button>
    </div>
  </div>
</template>

<script>
import IconBxTransfer from "~/assets/svg/icons/bx-transfer.svg?inline";
import IconArrowRightAlt24px from '~/assets/svg/v2-icons/arrow_right_alt_24px.svg?inline';
import { mapState, mapActions } from "vuex";
import { getDateBirthDay, getLocalTimeHH_MM_A } from "~/utils/moment";

const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];

export default {
  components: {
    IconBxTransfer,
    IconArrowRightAlt24px
  },

  props: {
    requestId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      daysChecked: [3],
    };
  },

  computed: {
    ...mapState("elearning/teaching/olclass-modify-schedule", [
      "scheduleListDetail",
    ]),
  },

  created() {
    this.DAYS = Object.freeze(DAYS);
    this.modifyScheduleListDetail(this.requestId);
  },

  methods: {
    getDateBirthDay,
    getLocalTimeHH_MM_A,
    ...mapActions("elearning/teaching/olclass-modify-schedule", [
      "modifyScheduleListDetail",
    ]),

    convertStart(tmp){
      console.log('convertStart')
      const indexOfCheck = tmp && tmp.lastIndexOf(" ");
      const checkData = tmp && tmp.slice(0, indexOfCheck);
      const dataTime = this.getLocalTimeHH_MM_A(`2020-01-01 ${checkData}`);
      return dataTime
    }
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/olclass/_online-class-detail.scss";
</style>
