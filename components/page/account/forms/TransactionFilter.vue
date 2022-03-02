<template>
  <filter-form>
    <div class="mb-3">
      <span class="filter-form__title">
        Chọn khoảng thời gian
      </span>
    </div>
    
    <div class="d-flex filter-form__input-wrapper">
      <div
        class="filter-form__item"
        style="min-width: 21rem;"
      >
        <app-range-calendar
          :placeholder="'DD/MM/YYYY - DD/MM/YYYY'"
          v-model="dateDefault"
          value-type="YYYY-MM-DD"
          bordered
          @change="changeDate"
        />
        <!-- <app-date-picker
          class="w-100"
          v-model="dateDefault"
          range
          size="sm"
          placeholder="DD/MM/YYYY - DD/MM/YYYY"
          :shortcuts="DATE_SHORTCUT"
          popup-class="datepicker-range-v2"
          value-type="YYYY-MM-DD"
          @input="changeDate"
        > -->
          <!--<template v-slot:icon-calendar>-->
          <!--<IconCalendar />-->
          <!--</template>-->
        <!-- </app-date-picker> -->
      </div>
      <div class="filter-form__item d-flex">
        <filter-button
          @click="clickSubmit"
          :color="filterSelect ? 'primary': 'white'"
        ></filter-button>
      </div>
      <div class="filter-form__item" v-if="filterSelect" style="min-width: 11.5rem;">
        <app-vue-select
          class="app-vue-select w-100"
          :options="statusOpts"
          :reduce="item => item.value"
          v-model="filters.status"
          label="text"
          placeholder="Trạng thái"
          @input="handleSelectStatus"
          :all-opt="allOpt"
        />
      </div>
      <div class="filter-form__item" v-if="filterSelect" style="min-width: 21rem;">
        <app-vue-select
          class="app-vue-select w-100"
          :options="paymentOpts"
          :reduce="item => item.value"
          v-model="filters.payment"
          label="text"
          placeholder="Phương thức thanh toán"
          @input="handleSelectPayment"
          :all-opt="allOpt"
        />
      </div>
    </div>
  </filter-form>
</template>

<script>
  import { DATE_SHORTCUT} from "~/utils/config";

  export default {
    data() {
      return {
        allOpt: {
          value: null,
          text: 'Tất cả'
        },
        filters:{
          status:'',
          payment:'',
        },
        statuses: [
          {
            value: -1,
            text: 'Thất bại'
          },
          {
            value: 0,
            text: 'Chờ xử lí'
          },
          {
            value: 1,
            text: 'Thành công'
          },
          {
            value: -2,
            text: 'Đã Huỷ'
          }
        ],
        payments:[
          {
            value: 'ATM',
            text: 'ATM/Internet Banking'
          },
          {
            value: 'CREDIT',
            text: 'Thẻ tín dung/Thẻ ghi nợ'
          }
        ],
        filterSelect:false,
        DATE_SHORTCUT: DATE_SHORTCUT,
        dateDefault: this.selectDateDefault
      }
    },
    props:{
      selectDateDefault:{
        type: Array,
        default: () => []
      }
    },
    computed: {
      statusOpts() {
        return [this.allOpt, ...this.statuses]
      },
      paymentOpts() {
        return [this.allOpt, ...this.payments]
      }
    },
    methods: {
      changeDate(date){
        this.$emit("changeDate", date);
        console.log(date)
      },
      handleSelectPayment(e){
        this.$emit("changePayment", e);
      },
      handleSelectStatus(s){
        this.$emit("changeStatus", s);
      },
      clickSubmit() {
        if (this.filterSelect) {
          this.resetForm()
          this.filterSelect = false
          this.$emit('submitFilter', this.filters)
        } else {
          this.filterSelect = true
        }
      },
      resetForm() {
        this.filters.status = null
        this.filters.payment = null
      }
    }
  }
</script>

<style scoped>

</style>