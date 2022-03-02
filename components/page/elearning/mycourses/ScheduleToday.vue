<template>
  <div class="wrap-schedulte-today-study-space">
    <div class="d-flex">
      <div class="d-flex align-items-center text-primary">
        <h4>Học gì hôm nay?</h4>
        <span class="ml-4">{{ dateSchedule | moment("Do MMMM, YYYY") }}</span>
      </div>
      <app-date-picker
        label="Chọn thời gian:"
        class="schedule-today-date-picker"
        v-model="dateSchedule"
        @input="changeDate"
        valueFormat="DD/MM/YYYY"
        valueType="YYYY-MM-DD"
        placeholder="DD/MM/YYYY"
      ></app-date-picker>
    </div>
    <div class="mb-3">
      <div class="day">
        <div class="item">Thứ 2</div>
        <div class="item">Thứ 3</div>
        <div class="item">Thứ 4</div>
        <div class="item">Thứ 5</div>
        <div class="item">Thứ 6</div>
        <div class="item">Thứ 7</div>
        <div class="item sunday">Chủ nhật</div>
      </div>
      <div class="day-number" v-if="dateSchedule">
        <div class="item" v-for="(item, index) in dayslist" :key="index">
          <span
            v-if="item == dayslist[dayslist.length - 1]"
            class="sunday"
            @click="changeDateInWeek(item)"
            :class="checkDate(item) ? 'active' : ''"
          >{{ item | moment("DD") }}</span>

          <span
            v-else
            :class="checkDate(item) ? 'active' : ''"
            @click="changeDateInWeek(item)"
          >{{ item | moment("DD") }}</span>
        </div>
      </div>
    </div>
    <div v-for="(item, index) in filterTimeTableList" :key="index">
      <div v-if="item" class="row schedule-item">
        <IconEllipse2 class="col-md-1" />
        <h5 class="col-md-3">{{ get(item, "text", "") }}</h5>
        <span class="col-md-5">
          <n-link :to="item.link">{{ get(item, "content", "") }}</n-link>
        </span>
        <span v-if="item.start_time && !item.end_time" class="col-md-3">
          Thời gian bắt đầu:
          {{ get(item, "start_time", "") | getDateTime_HH_mm }}
        </span>
        <span v-if="item.start_time && item.end_time" class="col-md-3">
          Thời gian học: {{ get(item, "start_time", "") | getDateTime_HH_mm }} -
          {{ get(item, "end_time", "") | getDateTime_HH_mm }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import IconEllipse2 from "~/assets/svg/icons/ellipse2.svg?inline";
import moment from "moment";
import { mapState } from "vuex";
import { get } from "lodash";
import * as constants from "~/utils/constants";
const STORE_OVERVIEW = "elearning/study/study-overview";
export default {
  components: {
    IconEllipse2
  },
  data() {
    return {
      dateSchedule: moment().format("YYYY-MM-DD"),
      dayslist: []
    };
  },
  computed: {
    ...mapState(STORE_OVERVIEW, ["timeTable"]),
    filterTimeTableList() {
      const data =
        this.timeTable &&
        this.timeTable.map(item => {
          if (
            item.type == constants.TYPE_TIME_TABLE.OLCLASS ||
            item.type == constants.TYPE_TIME_TABLE.ELEARNING
          ) {
            return {
              ...item,
              text: "Học online",
              link: `/elearning/${item.elearning_id}/study`
            };
          } else if (item.type == constants.TYPE_TIME_TABLE.EXCERCISE) {
            return;
          }
        });
      return data;
    }
  },
  created() {
    this.changeDate(this.dateSchedule);
  },
  methods: {
    get,
    changeDate(date) {
      console.log("changeDate", date);
      this.dayslist.length = 0;
      for (let i = 1; i <= 7; i++) {
        if (moment(date).day() == 0) {
          const day = moment(date)
            .day((i - 7).toString())
            .toString();
          this.dayslist.push(day);
        } else {
          const day = moment(date)
            .day(i.toString())
            .toString();
          this.dayslist.push(day);
        }
      }
      console.log("this.dayslist", this.dayslist);
      this.$emit("changeDateInWeek", date);
    },
    checkDate(d1) {
      // console.log('checkDate', d1)
      let date1 = moment(d1)
        .format("YYYY-MM-DD")
        .toString();
      let date2 = moment(this.dateSchedule)
        .format("YYYY-MM-DD")
        .toString();
      if (date1 == date2) {
        return true;
      } else return false;
    },
    changeDateInWeek(i) {
      console.log("changeDateInWeek1", i);
      this.dateSchedule = moment(i)
        .format("YYYY-MM-DD")
        .toString();
      console.log("this.dateSchedule", this.dateSchedule);
      this.$emit("changeDateInWeek", this.dateSchedule);
    },
    moment
  }
};
</script>

<style></style>
