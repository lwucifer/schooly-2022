<template>
  <div class="app-range-picker">
    <app-range-picker-calendar
      class="app-range-picker__calendar app-range-picker__calendar--start"
      :value="localValue"
      :calendar-month="startMonth"
      @change="handleChangeDate"
      @change-month="handleChangeStartMonth"
    />
    <app-range-picker-calendar
      class="app-range-picker__calendar app-range-picker__calendar--end"
      :index="1"
      :calendar-month="endMonth"
      :value="localValue"
      @change="handleChangeDate"
      @change-month="handleChangeEndMonth"
    />
  </div>
</template>

<script>
import moment from "moment";

export default {
  provide() {
    return {
      appRangePicker: this
    };
  },

  model: {
    prop: "value",
    event: "change"
  },

  props: {
    value: {
      type: Array,
      default: () => []
    }
  },

  data() {
    const startValue =
      this.value[0] && this.value[0] instanceof moment
        ? this.value[0]
        : moment();
    const endValue =
      this.value[1] && this.value[1] instanceof moment
        ? this.value[1]
        : moment().add(1, "M");

    return {
      localValue: this.value,
      startMonth: startValue.month(),
      endMonth: endValue.month()
    };
  },

  watch: {
    value(newValue) {
      this.localValue = newValue;
    },

    localValue(newValue) {
      this.$emit("change", newValue);
    }
  },

  methods: {
    handleChangeDate(date = []) {
      this.localValue = date;
    },

    handleChangeStartMonth(month) {
      this.startMonth = month;
      if (this.endMonth === month) {
        this.endMonth += 1;
      }
    },

    handleChangeEndMonth(month) {
      this.endMonth = month;
      if (this.startMonth === month) {
        this.startMonth -= 1;
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-range-picker.scss";
</style>