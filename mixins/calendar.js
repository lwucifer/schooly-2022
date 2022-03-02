import moment from "moment";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "Novemeber",
  "Decemeber"
];
const DAYS = ["M", "T", "W", "Th", "F", "Sa", "S"];
const PICK_MODES = {
  DATE: "DATE",
  MONTH: "MONTH",
  YEAR: "YEAR"
};

export default {
  model: {
    prop: "value",
    event: "change"
  },

  props: {
    value: {
      type: Object,
      default: () => moment(),
      validator: value => value instanceof moment
    },
    format: {
      type: String,
      default: undefined
    }
  },

  data() {
    const initialValue =
      this.value instanceof moment
        ? this.value
        : moment(new Date(), this.format);

    return {
      month: initialValue.month(),
      year: initialValue.year(),
      date: initialValue.date(),
      MONTHS: Object.freeze(MONTHS),
      DAYS: Object.freeze(DAYS),
      PICK_MODES: Object.freeze(PICK_MODES),
      localValue: initialValue,
      pickMode: PICK_MODES.DATE,
      dataDates: []
    };
  },

  created() {
    this.$_calendarMixin_getDays();
  },

  watch: {
    month(newValue) {
      this.$_calendarMixin_getDays();
    },

    year(newValue) {
      this.$_calendarMixin_getDays();
    },

    value(newValue) {
      this.localValue = newValue;
    },

    localValue(newValue) {
      this.$emit("change", newValue);
    }
  },

  methods: {
    $_calendarMixin_getDays() {
      const firstDay = new Date(this.year, this.month, 1);
      const lastDay = new Date(this.year, this.month + 1, 0);
      let offset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
      let dayCount = -offset + 1;
      let tmpDataDates = [];

      for (let i = 0; i < 6; i++) {
        tmpDataDates[i] = [];

        for (let j = 0; j < 7; j++) {
          if (dayCount > 42) {
            break;
          }
          tmpDataDates[i][j] = {
            index: dayCount,
            date: new Date(this.year, this.month, dayCount).getDate(),
            current: dayCount > 0 && dayCount <= lastDay.getDate()
          };
          dayCount++;
        }
      }

      this.dataDates = tmpDataDates;
    },

    $_calendarMixin_nextMonth() {
      if (this.month < 11) {
        this.month += 1;
      } else {
        this.year += 1;
        this.month = 0;

        const currentPickMode = this.pickMode;
        this.$nextTick(() => {
          this.pickMode = currentPickMode;
        })
      }
    },

    $_calendarMixin_prevMonth() {
      if (this.month > 0) {
        this.month -= 1;
      } else {
        this.year -= 1;
        this.month = 11;

        const currentPickMode = this.pickMode;
        this.$nextTick(() => {
          this.pickMode = currentPickMode;
        })
      }
    },

    $_calendarMixin_nextYear() {
      this.year += 1;
    },

    $_calendarMixin_prevYear() {
      this.year -= 1;
    },

    $_calendarMixin_handleChangeDate(index) {
      const value = moment(new Date(this.year, this.month, index), this.format);
      this.date = value.date();
      this.month = value.month();
      this.year = value.year();
      this.localValue = value;

      this.$nextTick(() => {
        this.pickMode = this.PICK_MODES.DATE;
      });
      this.$emit("changeDateToday", value);
    },

    $_calendarMixin_handleChangeMonth(month) {
      this.month = month;
      this.pickMode = this.PICK_MODES.DATE;
    },

    $_calendarMixin_handleChangeYear(year) {
      this.year = year;
      this.pickMode = this.PICK_MODES.MONTH;
    }
  }
};