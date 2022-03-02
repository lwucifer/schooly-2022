<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <SchoolAccountSide :active="2"/>
      </div>
      <div class="col-md-9">
        <block-section
          title="Lịch sử rút tiền"
          title-tag="h4"
          has-icon
        >
          <template v-slot:content>
            <sub-block-section
              :title-cls="{ 'border-0': true }"
              :content-cls="{ 'px-0': true, 'pt-0': true }"
              bg-content-color="transparent"
              :outline="false"
            >
              <template v-slot:title>
                <filter-form>
                  <div class="mb-2">
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
                        @change="handlerChangeDate"
                        />
                    </div>
                    <div class="filter-form__item d-flex">
                      <filter-button
                        @click="clickSubmit"
                        :color="filterSelect ? 'primary': 'white'"
                      ></filter-button>
                      <!--<filter-button @click="filterSelect= !filterSelect">-->
                        <!--Lọc kết quả-->
                      <!--</filter-button>-->
                    </div>
                    <div class="filter-form__item" v-if="filterSelect" style="min-width: 12rem;">
                      <app-vue-select
                        :options="statusOpts"
                        v-model="opt"
                        size="sm"
                        :placeholder="'Trạng thái'"
                        label="text"
                        class="app-vue-select"
                        @input="handlerChangeStatus"
                        :all-opt="allOpt"
                      />
                    </div>
                  </div>
                </filter-form>
              </template>
              <template v-slot:content>
                <app-table
                  :heads="heads"
                  :pagination="filterPagination"
                  @pagechange="onPageChange"
                  :data="list"
                  header-fontweight="normal"
                  header-size="md"
                  header-color="gray-3"
                  body-color="dark"
                  bg-table="white"
                  :header-ext-cls="{ 'table-header-border-0': true }"
                  :ext-table-cls="{ 'pt-3': true }"
                  :pagination-style="{ position: 'right' }"
                  @sort="handleSortTable"
                >
                  <template v-slot:cell(timestamp)="{row}">
                    <td>
                      {{ row.timestamp | moment("DD-MM-YYYY") }}
                    </td>
                  </template>
                  <template v-slot:cell(status)="{row}">
                    <td>
                      <span class="status-item d-inline-block" :class="statusClass(row.status)" style="min-width: 10.1rem;">
                        {{ row.status | withdrawalStatus2Txt}}
                      </span>
                    </td>
                  </template>
                  <template v-slot:cell(amount)="{row}">
                    <td>
                      {{ row.amount | numeralFormat("0,0") }} đ
                    </td>
                  </template>
                </app-table>
              </template>
            </sub-block-section>
          </template>
        </block-section>
      </div>
    </div>
  </div>
</template>

<script>
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide";
import IconFilter from "~/assets/svg/icons/filter.svg?inline";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { DATE_SHORTCUT} from "~/utils/config";
import moment from "moment";
import {
  WITHDRAWAL_STATUSES
} from "~/utils/constants"

export default {
  name: "E-learning",
  layout: 'account-info',

  components: {
    IconFilter,
    SchoolAccountSide,
  },

  data() {
    return {
      allOpt: {
        value: null,
        text: 'Tất cả'
      },
      filterSelect:false,
      heads: [
        {
          name: "timestamp",
          text: "Thời gian",
          sort: true,
          time: true
        },
        {
          name: "amount",
          text: "Giá trị",
        },
        {
          name: "desc",
          text: "Nội dung",
        },
        {
          name: "status",
          text: "Trạng thái",
        },
      ],
      isAuthenticated: true,
      pagination: {},
      params:{
        from:"",
        to:"",
        page:"",
        size:"",
        status:"",
        sort:""
      },
      opt: "",
      statuses: [
        { value: 'SUCCESS', text: 'Thành công' },
        { value: 'PENDING', text: 'Chờ xử lí' },
        { value: 'FAIL', text: 'Thất bại' }

      ],
      list:[],
      DATE_SHORTCUT: DATE_SHORTCUT,
      dateDefault:null,
    };
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState("account", {
      withdrawalsList: "withdrawalsList",
    }),
    statusOpts() {
      return [this.allOpt, ...this.statuses]
    },
    filterPagination() {
      return {
        size:get(this,"withdrawalsList.data.page.size",10),
        total_pages:get(this,"withdrawalsList.data.page.totalPages",0),
        total_elements:get(this,"withdrawalsList.data.page.totalElements",0),
        first:get(this,"withdrawalsList.data.page.first",false),
        last:get(this,"withdrawalsList.data.page.last",false),
        number_of_elements:get(this,"withdrawalsList.data.page.numberOfElements",0),
        number:get(this,"withdrawalsList.data.page.number",0)
      };
    }
  },
  created(){
    this.getDateSelect();
    this.fetchWithdrawals();
  },
  watch:{
    withdrawalsList:{
      handler:function(){
        this.list = get(this,"withdrawalsList.data.content",[]);
        this.pagination = get(this,"withdrawalsList.data.page",{});
      }
    }
  },
  methods: {
    getDateSelect(){
      const firstday = moment().startOf('month');
      const today = moment();
      this.dateDefault = [firstday,today];
      this.params.from = firstday.format("YYYY-MM-01");
      this.params.to = today.format("YYYY-MM-DD");
    },
    fetchWithdrawals(){
      const payload = {
        params :{
          to: this.params.to,
          from: this.params.from,
          size: this.params.size,
          page: this.params.page,
          status: this.params.status,
          sort: this.params.sort
        }
      }
      this.$store.dispatch(`account/${actionTypes.ACCOUNT_WITHDRAWALS.LIST}`,payload)
    },
    handlerChangeStatus(select){
      this.params.status = get(select,"value","");
      this.params.page =  1;
      this.fetchWithdrawals();
    },
    handlerChangeDate(date){
      this.params.from = date[0];
      this.params.to = date[1];
      this.fetchWithdrawals();
    },
    onPageChange(e) {
      this.params.size = e.size;
      this.params.page = e.number + 1;
      this.fetchWithdrawals();
    },
    statusClass(type) {
      if (type == WITHDRAWAL_STATUSES.SUCCESS) {
        return { 'status-item--success': true }
      } else if (type == WITHDRAWAL_STATUSES.PENDING) {
        return { 'status-item--pending': true }
      } else if (type == WITHDRAWAL_STATUSES.FAILED) {
        return { 'status-item--fail': true }
      } else {
        return {}
      }
    },
    clickSubmit() {
      if (this.filterSelect) {
        this.resetForm()
        this.filterSelect = false
        this.params.status = null
        this.fetchWithdrawals();
      } else {
        this.filterSelect = true
      }
    },
    resetForm() {
      this.opt = null
    },
    handleSortTable(val){
      if(val.sortBy=='timestamp'){
        if(val.order=='asc'){
          this.params.sort = 'created_at,asc'
          this.fetchWithdrawals();
        }
        else if(val.order=='desc'){
          this.params.sort = 'created_at,desc'
          this.fetchWithdrawals();
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-history.scss";
</style>