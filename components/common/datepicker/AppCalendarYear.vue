<template>
  <div class="app-calendar-year">
    <table class="app-calendar-year__table">
      <tbody>
        <tr v-for="(row, index) in dataYears" :key="index">
          <td
            v-for="year in row"
            :key="year"
            :class="{ active: value === year }"
            @click="chooseYear(year)"
          >
            <span>{{ year }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="app-calendar-year__arrow app-calendar-year__arrow--left" @click="prevYearGroup">
      <IconCalendarChevronLeft class="icon fill-opacity-1" />
    </button>
    <button class="app-calendar-year__arrow app-calendar-year__arrow--right" @click="nextYearGroup">
      <IconCalendarChevronRight class="icon fill-opacity-1" />
    </button>
  </div>
</template>

<script>
import IconCalendarChevronLeft from "~/assets/svg/icons/calendar-chevron-left.svg?inline";
import IconCalendarChevronRight from "~/assets/svg/icons/calendar-chevron-right.svg?inline";

export default {
  components: {
    IconCalendarChevronLeft,
    IconCalendarChevronRight
  },

  props: {
    value: {
      type: Number,
      default: new Date().getFullYear()
    }
  },

  data() {
    const offset = this.value % 10;
    const firstYear = this.value - offset;

    return {
      firstYear,
      dataYears: []
    };
  },

  created() {
    this.getYears();
  },

  watch: {
    firstYear(newValue) {
      this.getYears()
    }
  },

  methods: {
    getYears() {
      let yearCount = 0;
      let tmpDataYears = [];

      for (let i = 0; i < 5; i++) {
        tmpDataYears[i] = [];

        for (let j = 0; j < 2; j++) {
          tmpDataYears[i][j] = this.firstYear + yearCount;
          if (yearCount >= 10) {
            break;
          }
          yearCount++;
        }
      }

      this.dataYears = tmpDataYears;
    },

    chooseYear(year) {
      this.$emit("change", year);
    },

    prevYearGroup() {
      this.firstYear -= 10;
    },

    nextYearGroup() {
      this.firstYear += 10;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-calendar-year.scss";
</style>