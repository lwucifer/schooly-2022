<template>
  <div
    class="app-range-calendar"
    :class="classes"
    v-click-outside="hideOptions"
  >
    <div class="app-range-calendar__input-wrapper">
      <input
        class="app-range-calendar__placeholder"
        :placeholder="placeholder"
        @click="handleClickSelected"
        v-model="inputVal"
      >
      <i v-if="(!isValidLocalValue) || isEmptyValue" class="app-range-calendar__icon-select"><IconCalendar class="icon"/></i>
      <i v-else class="app-range-calendar__icon-close" @click="resetInput"><IconClose class="icon"/></i>
    </div>
    
    <div class="d-flex app-range-calendar__options" v-if="showDropdown">
      <div
        v-if="shortcuts"
        class="app-range-calendar__shortcuts"
      >
        <button
          class="app-range-calendar__shortcut-item"
          :class="{ 'app-range-calendar__shortcut-item--active': shortcutActive == index }"
          v-for="(item, index) in shortcuts"
          :key="index"
          @click="selectShortcut({item, index})"
        >
          {{ item.text }}
        </button>
      </div>
      <div class="app-range-calendar__calendar" v-if="showRangeSelection">
        <app-range-picker-panel
          v-model="localValue"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import IconCalendar from "~/assets/svg/v2-icons/calendar_today_24px.svg?inline"
  import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline"
  import { get } from "lodash"
  import moment from "moment";

  export default {
    name: "AppCalendarRange",
    model: {
      prop: "value",
      event: "change",
    },
    props: {
      shortcuts: {
        type: Array,
        default: () => {
          return [
            {
              text: 'Hôm nay',
              onClick() {
                const start = moment();
                const end = moment();
                return [start, end]
              },
            },
            {
              text: 'Hôm qua',
              onClick() {
                const end = moment().subtract(1, 'day');
                const start = moment().subtract(1, 'day');
                return [start, end]
              },
            },
            {
              text: 'Tuần này',
              onClick() {
                const end = moment().endOf("week");
                const start = moment().startOf("week");
                return [start, end];
              },
            },
            {
              text: 'Tháng này',
              onClick() {
                const end = moment().endOf('month');
                const start = moment().startOf('month');
                return [start, end];
              },
            },
            {
              text: 'Tháng trước',
              onClick() {
                const end = moment().subtract(1, 'months').endOf('month');
                const start = moment().subtract(1, 'months').startOf('month');
                return [start, end];
              },
            },
            {
              text: 'Tùy chọn',
              showPanelDate: true
            }
          ]
        }
      },
      placeholder: {
        type: String
      },
      size: {
        type: String,
        default: 'sm'
      },
      rangeSeparator: {
        type: String,
        default: '-'
      },
      valueType: { // format returned value 
        type: String,
        default: 'YYYY-MM-DD'
      },
      format: { // format display into input
        type: String,
        default: 'DD/MM/YYYY'
      },
      bordered: Boolean,
      value: {
        type: Array,
        default: () => []
      }
    },
    components: {
      IconCalendar,
      IconClose
    },
    data() {
      return {
        active: false,
        showRangeSelection: false,
        shortcutActive: null,
        localValue: this.value
      }
    },
    watch: {
      localValue(newValue) {
        if (this.isValidLocalValue) {
          let parsedData = []
          if (newValue.length == 2) {
            parsedData = [
              newValue[0].format(this.valueType),
              newValue[1].format(this.valueType)
            ]
          }
          this.$emit('change', parsedData)
          this.hideOptions()
        }
      }
    },
    computed: {
      inputVal: function() {
        if (!this.isValidLocalValue) {
          return null
        } else {
          if (this.localValue[0] instanceof moment && this.localValue[1] instanceof moment) {
            return `${this.localValue[0].format(this.format)} ${this.rangeSeparator} ${this.localValue[1].format(this.format)}`
          } else {
            return null
          }
        }
      },
      isValidLocalValue() {
        return (this.localValue && this.localValue[0] && this.localValue[1]) || this.isEmptyValue
      },
      classes() {
        return {
          active: this.active,
          "app-range-calendar--size-sm": this.size === "sm",
          "app-range-calendar--size-md": this.size === "md",
          "app-range-calendar--size-lg": this.size === "lg",
          "app-range-calendar--bordered": this.bordered,
        };
      },
      showDropdown() {
        return this.active
      },
      isEmptyValue() {
        return this.localValue == null ||
               this.isSame([], this.localValue) ||
               this.isSame([null, null], this.localValue)
      }
    },
    methods: {
      handleClickSelected() {
        this.active = true
      },
      selectShortcut({item, index}) {
        this.shortcutActive = index
        if (get(item, 'showPanelDate', false)) {
          this.showRangeSelection = true
        } else {
          this.showRangeSelection = false
          const rangeDate = item.onClick()
          this.localValue = rangeDate
        }

      },
      hideOptions() {
        this.active = false
      },
      resetInput() {
        this.localValue = []
      },
      isSame(arr1, arr2){ // compare 2 array
        return (arr1.length == arr2.length) && arr1.every(function(element, index) {
            return element === arr2[index]; 
        });
      },
      get
    }
  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/app/_app-range-calendar.scss";
</style>
