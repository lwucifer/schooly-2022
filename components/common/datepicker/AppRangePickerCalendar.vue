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
        class="app-calendar-date--range"
        :index="index"
        :dates="dataDates"
        :is-match-date="checkIsMatchDate('month')"
        :is-between-date="isBetweenDate"
        :active-dates="localValue.filter(item => item.month() === month).map(item => item.date())"
        @change="$_calendarMixin_handleChangeDate"
      />
      <app-calendar-month
        v-show="pickMode === PICK_MODES.MONTH"
        :value="month"
        :is-match-date="checkIsMatchDate('year')"
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

export default {
  components: {
    IconCalendarChevronLeft,
    IconCalendarChevronRight,
    IconCalendarArrowDown
  },

  mixins: [calendarMixin],

  props: {
    value: {
      type: Array,
      default: () => [],
      validator: value => value.every(v => v instanceof moment)
    },
    index: {
      type: Number,
      default: 0,
      validator: value => [0, 1].includes(value)
    },
    calendarMonth: {
      type: Number,
      default: new Date().getMonth(),
      validator: value => value >= 0 && value <= 11
    }
  },

  data() {
    const initialValue =
      this.value[0] && this.value[0] instanceof moment
        ? this.value[0]
        : moment(new Date(), this.format);

    return {
      month: this.calendarMonth,
      year: initialValue.year(),
      date: initialValue.date(),
      localValue: this.value
    };
  },

  computed: {
    isBetweenDate() {
      const [startDate = null, endDate = null] = this.localValue;
      if (!startDate || !endDate) return false;
      const currentDate = moment(new Date(this.year, this.month, this.date));
      return currentDate.isBetween(startDate, endDate, undefined, "[]");
    }
  },

  watch: {
    calendarMonth(newValue) {
      if (newValue > 11) {
        this.month = 0;
        this.year += 1;
      } else if (newValue < 0) {
        this.month = 11;
        this.year -= 1;
      } else {
        this.month = newValue
      }
    },

    month(newValue) {
      this.$emit("change-month", newValue);
    }
  },

  methods: {
    $_calendarMixin_handleChangeDate(index) {
      const value = moment(new Date(this.year, this.month, index), this.format);
      this.date = value.date();
      this.month = value.month();
      this.year = value.year();

      if (this.localValue.length === 2) {
        this.localValue = [value];
      } else if (this.localValue.length === 1) {
        this.localValue = this.localValue[0].isSameOrBefore(value)
          ? [this.localValue[0], value]
          : [value, this.localValue[0]];
      } else {
        this.localValue = [value];
      }

      this.$nextTick(() => {
        this.pickMode = this.PICK_MODES.DATE;
      });
    },

    checkIsMatchDate(modifier) {
      const [startDate = null, endDate = null] = this.localValue;
      const currentDate = new Date(this.year, this.month, this.date);
      const condition1 = startDate
        ? startDate.isSame(currentDate, modifier)
        : false;
      const condition2 = endDate
        ? endDate.isSame(currentDate, modifier)
        : false;

      if (startDate && endDate && startDate.isSame(endDate, modifier)) {
        return condition1;
      }

      if (startDate && startDate.month() === this.month) {
        return condition1;
      } else {
        return condition2;
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-calendar.scss";
</style>
