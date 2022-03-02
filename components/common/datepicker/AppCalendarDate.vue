<template>
  <table class="app-calendar-date">
    <thead>
      <tr>
        <th v-for="day in DAYS" :key="day">{{ day }}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(row, index) in dates" :key="index">
        <td
          v-for="(data, i) in row"
          :key="i"
          :class="{
            'current-month': data.current,
            'active': isMatchDate && activeDates.includes(data.index),
            'in-range': checkIsInRange(data.index),
            'start-range': checkIsInRange(data.index) && checkIsStartRange(data.index),
            'end-range': checkIsInRange(data.index) && checkIsEndRange(data.index)
          }"
          @click="chooseDate(data.index)"
        >
          <span v-if="data !== null">{{ data.date }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
const DAYS = ["M", "T", "W", "Th", "F", "Sa", "S"];

export default {
  props: {
    dates: {
      type: Array,
      default: () => []
    },
    activeDates: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0,
      validator: value => [0, 1].includes(value)
    },
    isMatchDate: Boolean,
    isBetweenDate: Boolean
  },

  data() {
    return {
      DAYS: Object.freeze(DAYS)
    };
  },

  methods: {
    chooseDate(index) {
      this.$emit("change", index);
    },

    checkIsInRange(index) {
      // return isBetweenDate && (activeDates[0] ? activeDates[0] < data.index : true)  && (activeDates[1] ? activeDates[1] > data.index : true)
      if (!this.isBetweenDate) return false;
      if (this.activeDates.length === 2) {
        return this.activeDates[0] <= index && this.activeDates[1] >= index;
      } else if (this.activeDates.length === 1) {
        return this.index === 0
          ? this.activeDates[0] <= index
          : this.activeDates[0] >= index;
      } else {
        return true;
      }
    },

    checkIsStartRange(index) {
      if (this.activeDates.length === 2) {
        return this.activeDates[0] === index;
      } else if (this.activeDates.length === 1) {
        return this.index === 0 ? this.activeDates[0] === index : false;
      } else {
        return false;
      }
    },

    checkIsEndRange(index) {
      if (this.activeDates.length === 2) {
        return this.activeDates[1] === index;
      } else if (this.activeDates.length === 1) {
        return this.index === 1 ? this.activeDates[0] === index : false;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-calendar-date.scss";
</style>