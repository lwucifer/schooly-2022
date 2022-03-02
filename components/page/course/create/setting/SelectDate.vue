<template>
  <div>
    <app-date-picker
      size="sm"
      placeholder="dd/mm/yyyy"
      value-type="YYYY-MM-DD"
      class="mr-3"
      @input="handleChangeDate"
      :value="date"
      :disabled="disabled"
    >
      <template v-slot:icon-calendar>
        <IconCalender class="fill-primary" />
      </template>
    </app-date-picker>

    <app-date-picker
      size="sm"
      type="time"
      placeholder="h:mm a"
      value-format="h:mm a"
      class="ml-0 mr-6"
      @input="handleChangeTime"
      :value="time"
      :disabled="disabled"
    />
  </div>
</template>

<script>
import IconCalender from "~/assets/svg/v2-icons/calendar_today_24px.svg?inline";
import moment from "moment";
import { trim } from "lodash";

export default {
  components: {
    IconCalender,
  },

  props: {
    value: {},
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      date: "",
      time: "",
    };
  },

  watch: {
    value: {
      immediate: true,
      handler: function () {
        if (!this.value) {
          this.date = "";
          this.time = "";
          return;
        }
        this.date = moment(this.value).format("YYYY-MM-DD");

        let time = moment(this.value).format("HH:mm");
        let hours = Number(time.match(/^(\d+)/)[1]);
        let minutes = Number(time.match(/:(\d+)/)[1]);
        let AMPM = "am";
        if (hours >= 12) {
          AMPM = "pm";
          hours = hours - 12;
        }
        if (hours < 10) hours = "0" + hours.toString();
        if (minutes < 10) minutes = "0" + minutes.toString();

        this.time = `${hours}:${minutes} ${AMPM}`;
      },
    },
    date: {
      handler: function () {
        let time = this.date;
        if (this.time && time) time += " " + this.formatTime(this.time);
        this.$emit("onChange", time);
      },
    },
    time: {
      handler: function () {
        let time = this.date;
        if (this.time && time) time += " " + this.formatTime(this.time);
        this.$emit("onChange", time);
      },
    },
  },

  methods: {
    handleChangeDate(date) {
      this.date = date;
    },
    handleChangeTime(time) {
      this.time = time;
    },

    formatTime(time) {
      let hours = Number(time.match(/^(\d+)/)[1]);
      let minutes = Number(time.match(/:(\d+)/)[1]);
      let AMPM = time.match(/\s(.*)$/)[1];
      if (AMPM == "pm" && hours < 12) hours = hours + 12;
      if (AMPM == "am" && hours == 12) hours = hours - 12;
      let sHours = hours.toString();
      let sMinutes = minutes.toString();
      if (hours < 10) sHours = "0" + sHours;
      if (minutes < 10) sMinutes = "0" + sMinutes;
      return sHours + ":" + sMinutes + ":00";
    },
  },
};
</script>
