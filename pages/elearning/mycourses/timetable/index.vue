<template>
  <div class="container wrap__study-space page-mycourses-timetable">
    <div class="row">
      <div class="col-md-3">
        <MyCourseSide :active="6">
          <template slot="calendar">
            <div class="timetable-calendar-divider"></div>
            <app-calendar v-model="calendar" @changeDateToday="changeDateToday" />
          </template>
        </MyCourseSide>
      </div>

      <div class="col-md-9">
        <div class="mycourses">
          <h1 class="mycourses__title heading-4">Thời khoá biểu</h1>

          <div class="mycourses__content">
            <!-- <app-range-picker-panel /> -->

            <!-- <app-date-picker
              type="datetime"
              range
              placeholder="Select datetime range"
            ></app-date-picker>-->
            <nav class="timetable-nav">
              <div class="timetable-nav__left">
                <h2 class="timetable-nav__title title">Học gì hôm nay?</h2>
                <a href class="timetable-nav__date">{{todayDate}}</a>
              </div>

              <div class="timetable-nav__right">
                <a
                  href
                  class="timetable-nav__icon-text"
                  :class="checkTimeTable ? 'active' :''"
                  @click.prevent="selectDay"
                >
                  <IconCalendarDay class="icon fill-opacity-1" />Hôm nay
                </a>
                <a
                  href
                  class="timetable-nav__icon-text"
                  :class="checkTimeTableWeek ? 'active' :''"
                  @click.prevent="selectWeek"
                >
                  <IconCalendarWeek class="icon fill-opacity-1" />Tuần này
                </a>
                <a
                  href
                  class="timetable-nav__icon-text"
                  :class="checkTimeTableMonth ? 'active' :''"
                  @click.prevent="selectMonth"
                >
                  <IconCalendarMonth class="icon fill-opacity-1" />Tháng này
                </a>
                <app-dropdown
                  class="timetable-nav__dropdown"
                  position="bottomRight"
                  @visible-change="toggleDropdownDate"
                >
                  <a slot="activator" href class="timetable-nav__more" @click.prevent>
                    <IconMoreHoriz class="icon fill-opacity-1" />
                  </a>

                  <div class="timetable-nav__dropdown-content">
                    <button
                      v-if="!showRangeDatePicker"
                      @click="() => { showRangeDatePicker = true }"
                    >Chọn thời gian khác</button>
                    <app-range-picker-panel v-if="showRangeDatePicker" @change="selectRangeDate" />
                  </div>
                </app-dropdown>
              </div>
            </nav>

            <div class="timetable-table" v-if="checkTimeTable">
              <table class="timetable-table__table">
                <thead>
                  <tr>
                    <th>Thứ 2</th>
                    <th>Thứ 3</th>
                    <th>Thứ 4</th>
                    <th>Thứ 5</th>
                    <th>Thứ 6</th>
                    <th>Thứ 7</th>
                    <th class="text-pink-2">Chủ nhật</th>
                  </tr>
                </thead>

                <tbody>
                  <tr class="item">
                    <td v-for="(item, index) in dayslist" :key="index">
                      <span
                        v-if="item == dayslist[dayslist.length -1]"
                        class="text-pink-2"
                        @click="changeDateInWeek(item)"
                        :class="checkDate(item) ? 'active' :''"
                      >{{item | moment('DD')}}</span>
                      <span
                        v-else
                        :class="checkDate(item) ? 'active' :''"
                        @click="changeDateInWeek(item)"
                      >{{item | moment('DD')}}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="timetable-range-status" v-if="checkTimeTableWeek">
              <span class="mr-2">Khoảng thời gian:</span>
              từ:
              <span class="text-primary mr-2">{{firstDayWeek}}</span> đến:
              <span class="text-primary">{{lastDayWeek}}</span>
            </div>
            <div class="timetable-range-status" v-if="checkTimeTableMonth">
              <span class="mr-2">Khoảng thời gian:</span>
              từ:
              <span class="text-primary mr-2">{{firstDayMonth}}</span> đến:
              <span class="text-primary">{{lastDayMonth}}</span>
            </div>
            <div class="timetable-range-status" v-if="checkTimeTableRange">
              <span class="mr-2">Khoảng thời gian:</span>
              từ:
              <span
                class="text-primary mr-2"
              >{{queryFromTo.from | moment('D MMMM, YYYY')}}</span> đến:
              <span class="text-primary">{{queryFromTo.to | moment('D MMMM, YYYY')}}</span>
            </div>

            <ul class="timetable-list" v-if="checkDataTable">
              <li
                class="timetable-list-item active"
                v-for="(item,index) in timeTableListWithPagination.data || []"
                :key="index"
              >
                <span class="timetable-list-item__dot" :class="item.ended ? 'text-ended' : ''"></span>
                <span class="timetable-list-item__title">{{item.text}}</span>

                <span class="timetable-list-item__subtitle">
                  <!-- {{item.content}} -->
                  <n-link :to="item.link" :class="item.ended ? 'text-warning' : ''">{{item.content}}</n-link>
                </span>

                <span
                  class="timetable-list-item__time"
                >{{item.text_time}}: {{ item.start_time | getDateTime_HH_mm }} {{item && item.end_time && item.start_time ? '-' : ''}} {{ item.end_time | getDateTime_HH_mm }}</span>
              </li>
            </ul>
            <div
              class="text-gray-2 text-center mt-6"
              v-else
            >Không có thời khóa biểu nào trong khoảng thời gian này</div>

            <app-pagination
              class="mt-5"
              :pagination="timeTableListWithPagination.pagination || {}"
              @pagechange="changePage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

import MyCourseSide from "~/components/page/elearning/mycourses/MyCourseSide";
import IconCalendarDay from "~/assets/svg/icons/calendar-day.svg?inline";
import IconCalendarWeek from "~/assets/svg/icons/calendar-week.svg?inline";
import IconCalendarMonth from "~/assets/svg/icons/calendar-month.svg?inline";
import IconMoreHoriz from "~/assets/svg/v2-icons/more_horiz_24px.svg?inline";
import { mapState, mapActions, mapMutations } from "vuex";
import { TIMETABLE } from "~/utils/mutation-types";
import * as actionTypes from "~/utils/action-types";
import * as constants from "~/utils/constants";
import {
  getDateTimeFrom,
  getDateTimeTo,
  getDateTime_HH_mm,
} from "~/utils/moment";
const STORE_NAME_TIMETABLE = "elearning/mycourses/timetable";

export default {
  middleware: ["authenticated"],

  async fetch({ params, query, store, route }) {
    const data = {
      from: getDateTimeFrom(moment()),
      to: getDateTimeTo(moment()),
    };
    await Promise.all([
      store.dispatch(
        `${STORE_NAME_TIMETABLE}/${actionTypes.TIMETABLE.TIMETABLE_LIST}`,
        {
          params: data,
        }
      ),
    ]);
  },

  components: {
    MyCourseSide,
    IconCalendarDay,
    IconCalendarWeek,
    IconCalendarMonth,
    IconMoreHoriz,
  },

  data() {
    return {
      calendar: moment(),
      dayslist: [],
      dateSchedule: moment(),
      todayDate: moment().format("D MMMM, YYYY"),
      checkTimeTable: true,
      checkTimeTableMonth: false,
      checkTimeTableWeek: false,
      checkTimeTableRange: false,
      firstDayWeek: moment().startOf("week").format("D MMMM, YYYY"),
      lastDayWeek: moment().endOf("week").format("D MMMM, YYYY"),
      firstDayMonth: moment().startOf("month").format("D MMMM, YYYY"),
      lastDayMonth: moment().endOf("month").format("D MMMM, YYYY"),
      queryFromTo: {
        from: null,
        to: null,
      },
      paginationPage: 1,
      showRangeDatePicker: false,
    };
  },
  computed: {
    ...mapState(STORE_NAME_TIMETABLE, ["timeTableList"]),

    filterTimeTableList() {
      const data =
        this.timeTableList &&
        this.timeTableList.map((item) => {
          if (
            item.type == constants.TYPE_TIME_TABLE.OLCLASS ||
            item.type == constants.TYPE_TIME_TABLE.ELEARNING
          ) {
            return {
              ...item,
              text: "Học online",
              text_time: "Thời gian học",
              link: `/elearning/${item.elearning_id}/study`,
              ended:
                item.end_time &&
                Date.parse(item.end_time) <= moment().valueOf(),
            };
          } else if (item.type == constants.TYPE_TIME_TABLE.EXERCISE) {
            if (item.category == constants.TYPE_TIME_TABLE.EXERCISE) {
              return {
                ...item,
                text: "Làm bài tập",
                text_time: "Thời gian bắt đầu",
                link: `/elearning/${item.elearning_id}/study?elearning_id=${item.elearning_id}&lesson_id=${item.lesson_id}&category_type=EXERCISE`,
                ended:
                  item.end_time &&
                  Date.parse(item.end_time) <= moment().valueOf(),
              };
            } else {
              return {
                ...item,
                text: "Làm bài kiểm tra",
                text_time: "Thời gian bắt đầu",
                link: `/elearning/${item.elearning_id}/study?elearning_id=${item.elearning_id}&category_type=TEST`,
                ended:
                  item.end_time &&
                  Date.parse(item.end_time) <= moment().valueOf(),
              };
            }
          } else {
            return {
              ...item,
              text: "Làm bài kiểm tra",
              text_time: "Thời gian bắt đầu",
              link: `/elearning/${item.elearning_id}/study?elearning_id=${item.elearning_id}&category_type=TEST`,
              ended:
                item.end_time &&
                Date.parse(item.end_time) <= moment().valueOf(),
            };
          }
        });
      return data;
    },

    checkDataTable() {
      return this.timeTableList && this.timeTableList.length > 0 ? true : false;
    },

    timeTableListWithPagination() {
      const n = this.paginationPage; // current page
      const x = 10; // items in page
      const begin = (n - 1) * x;
      const end = (n - 1) * x + x;
      const items = this.filterTimeTableList.slice(begin, end);
      const totalPages = Math.ceil(this.filterTimeTableList.length / x);

      return {
        data: items,
        pagination: {
          first: n === 0,
          last: n === totalPages,
          number: n - 1,
          number_of_elements: items.length,
          size: x,
          total_elements: this.filterTimeTableList.length,
          total_pages: totalPages,
          begin,
          end,
        },
      };
    },
  },

  created() {
    this.changeDate(this.calendar);
  },

  watch: {
    timeTableList(newValue) {
      this.paginationPage = 1;
    },
  },

  methods: {
    getDateTime_HH_mm,
    ...mapMutations(STORE_NAME_TIMETABLE, ["setStateTimeTable"]),
    ...mapActions(STORE_NAME_TIMETABLE, ["getTimeTableList"]),
    changeDate(date) {
      this.dayslist.length = 0;
      let dayItem = [];
      console.log("date", date);
      for (let i = 1; i <= 7; i++) {
        if (moment(date).day() == 0) {
          const day = moment(date).day(i - 7);
          this.dayslist.push(day);
        } else {
          const day = moment(date).day(i);
          this.dayslist.push(day);
        }
      }
    },
    checkDate(d1) {
      let date1 = moment(d1).format("YYYY-MM-DD").toString();
      let date2 = moment(this.calendar).format("YYYY-MM-DD").toString();
      if (date1 == date2) {
        return true;
      } else return false;
    },
    changeDateInWeek(i) {
      this.calendar = moment(i);
      this.setStateTimeTable(this.calendar);
      this.todayDate = moment(i).format("D MMMM, YYYY");
      console.log("i", this.todayDate);
      this.queryFromTo.from = getDateTimeFrom(i);
      this.queryFromTo.to = getDateTimeTo(i);
      this.getTimeTableList({ params: this.queryFromTo });
      // console.log(this.calendar);
    },
    selectDay() {
      this.checkTimeTable = true;
      this.checkTimeTableMonth = false;
      this.checkTimeTableWeek = false;
      this.checkTimeTableRange = false;
      this.calendar = moment();
      this.todayDate = moment().format("D MMMM, YYYY");
      this.queryFromTo.from = getDateTimeFrom(moment());
      this.queryFromTo.to = getDateTimeTo(moment());
      this.getTimeTableList({ params: this.queryFromTo });
    },
    selectWeek() {
      this.checkTimeTableWeek = true;
      this.checkTimeTableMonth = false;
      this.checkTimeTable = false;
      this.checkTimeTableRange = false;
      this.queryFromTo.from = getDateTimeFrom(moment().startOf("week"));
      this.queryFromTo.to = getDateTimeTo(moment().endOf("week"));
      this.getTimeTableList({ params: this.queryFromTo });
    },
    selectMonth() {
      this.checkTimeTableMonth = true;
      this.checkTimeTableWeek = false;
      this.checkTimeTable = false;
      this.checkTimeTableRange = false;
      this.queryFromTo.from = getDateTimeFrom(moment().startOf("month"));
      this.queryFromTo.to = getDateTimeTo(moment().endOf("month"));
      this.getTimeTableList({ params: this.queryFromTo });
    },
    selectRangeDate(data) {
      this.checkTimeTableRange = true;
      this.checkTimeTableMonth = false;
      this.checkTimeTableWeek = false;
      this.checkTimeTable = false;
      if (data) {
        this.queryFromTo.from = getDateTimeFrom(data[0]);
        this.queryFromTo.to = data[1]
          ? getDateTimeTo(data[1])
          : getDateTimeTo(data[0]);
        this.getTimeTableList({ params: this.queryFromTo });
      }
    },
    changeDateToday(value) {
      this.checkTimeTable = false;
      this.checkTimeTableMonth = false;
      this.checkTimeTableWeek = false;
      console.log("[changeDateToday] value", value);
      this.queryFromTo.from = getDateTimeFrom(value);
      this.queryFromTo.to = getDateTimeTo(value);
      this.getTimeTableList({ params: this.queryFromTo });
      this.todayDate = value.format("D MMMM, YYYY");
    },
    changePage({ number }) {
      this.paginationPage = number + 1;
    },
    toggleDropdownDate(data) {
      if (!data) {
        this.showRangeDatePicker = false;
      }
    },
  },
};
</script>

<style lang="scss">
// @import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
@import "~/assets/scss/components/elearning/_elearning-my-courses";
</style>

<style lang="scss" scoped>
@import "~/assets/scss/pages/elearning/mycourses/_timetable.scss";
</style>
