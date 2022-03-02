<template>
  <div class="app-calendar">
    <div class="app-calendar__nav">
      <div class="app-calendar__select-year" @click="pickMode = PICK_MODES.YEAR">
        {{ MONTHS[month] }} {{ year }}
        <IconCalendarArrowDown class="icon fill-opacity-1" />
      </div>
      <div class="app-calendar__nav-right">
        <button class="app-calendar__nav-btn" @click="$_calendarMixin_prevMonth">
          <IconCalendarChevronLeft class="icon fill-opacity-1" />
        </button>
        <button class="app-calendar__nav-btn" @click="$_calendarMixin_nextMonth">
          <IconCalendarChevronRight class="icon fill-opacity-1" />
        </button>
      </div>
    </div>

    <div class="app-calendar__calendar">
      <app-calendar-date
        v-show="pickMode === PICK_MODES.DATE"
        :dates="dataDates"
        :is-match-date="localValue.isSame(new Date(year, month, date), 'month')"
        :active-dates="[this.localValue.date()]"
        @change="$_calendarMixin_handleChangeDate"
      />
      <app-calendar-month
        v-show="pickMode === PICK_MODES.MONTH"
        :value="month"
        :is-match-date="localValue.isSame(new Date(year, month, date), 'year')"
        @change="$_calendarMixin_handleChangeMonth"
      />
      <app-calendar-year
        v-show="pickMode === PICK_MODES.YEAR"
        :value="year"
        @change="$_calendarMixin_handleChangeYear"
      />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import calendarMixin from "~/mixins/calendar";
import IconCalendarChevronLeft from "~/assets/svg/icons/calendar-chevron-left.svg?inline";
import IconCalendarChevronRight from "~/assets/svg/icons/calendar-chevron-right.svg?inline";
import IconCalendarArrowDown from "~/assets/svg/icons/calendar-arrow-down.svg?inline";

// const MONTHS = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "Novemeber",
//   "Decemeber"
// ];
// const DAYS = ["M", "T", "W", "Th", "F", "Sa", "S"];
// const PICK_MODES = {
//   DATE: "DATE",
//   MONTH: "MONTH",
//   YEAR: "YEAR"
// };

export default {
  components: {
    IconCalendarChevronLeft,
    IconCalendarChevronRight,
    IconCalendarArrowDown
  },

  mixins: [calendarMixin],

  // model: {
  //   prop: "value",
  //   event: "change"
  // },

  // props: {
  //   value: {
  //     type: Object,
  //     default: () => moment(),
  //     validator: value => value instanceof moment
  //   },
  //   format: {
  //     type: String,
  //     default: undefined
  //   }
  // },

  // data() {
  //   const initialValue =
  //     this.value instanceof moment
  //       ? this.value
  //       : moment(new Date(), this.format);

  //   return {
  //     month: initialValue.month(),
  //     year: initialValue.year(),
  //     date: initialValue.date(),
  //     MONTHS: Object.freeze(MONTHS),
  //     DAYS: Object.freeze(DAYS),
  //     PICK_MODES: Object.freeze(PICK_MODES),
  //     localValue: initialValue,
  //     pickMode: PICK_MODES.DATE,
  //     dataDates: []
  //   };
  // },

  // created() {
  //   this.getDays();
  // },

  // watch: {
  //   month(newValue) {
  //     this.getDays();
  //   },

  //   year(newValue) {
  //     this.getDays();
  //   },

  //   value(newValue) {
  //     this.localValue = newValue;
  //   },

  //   localValue(newValue) {
  //     this.$emit("change", newValue);
  //   }
  // },

  // methods: {
  //   getDays() {
  //     const firstDay = new Date(this.year, this.month, 1);
  //     const lastDay = new Date(this.year, this.month + 1, 0);
  //     let offset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  //     let dayCount = -offset + 1;
  //     let tmpDataDates = [];

  //     for (let i = 0; i < 6; i++) {
  //       tmpDataDates[i] = [];

  //       for (let j = 0; j < 7; j++) {
  //         if (dayCount > 42) {
  //           break;
  //         }
  //         tmpDataDates[i][j] = {
  //           index: dayCount,
  //           date: new Date(this.year, this.month, dayCount).getDate(),
  //           current: dayCount > 0 && dayCount <= lastDay.getDate()
  //         };
  //         dayCount++;
  //       }
  //     }

  //     this.dataDates = tmpDataDates;
  //   },

  //   nextMonth() {
  //     if (this.month < 11) {
  //       this.month += 1;
  //     } else {
  //       this.year += 1;
  //       this.month = 0;

  //       const currentPickMode = this.pickMode;
  //       this.$nextTick(() => {
  //         this.pickMode = currentPickMode;
  //       })
  //     }

  //   },

  //   prevMonth() {
  //     if (this.month > 0) {
  //       this.month -= 1;
  //     } else {
  //       this.year -= 1;
  //       this.month = 11;

  //       const currentPickMode = this.pickMode;
  //       this.$nextTick(() => {
  //         this.pickMode = currentPickMode;
  //       })
  //     }

  //   },

  //   nextYear() {
  //     this.year += 1;
  //   },

  //   prevYear() {
  //     this.year -= 1;
  //   },

  //   handleChangeDate(index) {
  //     const value = moment(new Date(this.year, this.month, index), this.format);
  //     this.date = value.date();
  //     this.month = value.month();
  //     this.year = value.year();
  //     this.localValue = value;

  //     this.$nextTick(() => {
  //       this.pickMode = PICK_MODES.DATE;
  //     });
  //   },

  //   handleChangeMonth(month) {
  //     this.month = month;
  //     this.pickMode = PICK_MODES.DATE;
  //   },

  //   handleChangeYear(year) {
  //     this.year = year;
  //     this.pickMode = PICK_MODES.MONTH;
  //   }
  // }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-calendar.scss";
</style>
