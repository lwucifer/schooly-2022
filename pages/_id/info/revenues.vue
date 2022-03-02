<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <SchoolAccountSide :active="3" />
      </div>
      <div class="col-md-9">
        <div class="elearning-history__main py-0" style="background: transparent;">
          <block-section title="Doanh thu">
            <template v-slot:content>
              <sub-block-section
                :title-cls="{'border-0': true }"
                class="mb-0"
              >
                <template v-slot:title>
                  <div class="row">
                    <div class="col-md-6 d-flex align-items-center">
                      <span class="mr-3">Số dư khả dụng:</span>
                      <strong
                        style="color: #E9446A;"
                        class="h3 mr-4"
                      >{{ balance | numeralFormat("0,0")}} {{ CURRENCY }}</strong>
                      <app-button
                        size="sm"
                        nuxt
                        :disabled="!token"
                        :to="token ? '/' + token.id + '/info/do_withdrawals' : '/'"
                      >Rút tiền</app-button>
                    </div>
                    <div class="col-md-6">
                      <div class="text-md-right">
                        <app-button
                          nuxt
                          color="transparent"
                          :disabled="!token"
                          :to="token ? '/' + token.id + '/info/withdrawals' : '/'"
                          style="color: #656565; font-weight: normal; box-shadow: none;"
                          class="px-0"
                        >
                          <slot name="icon">
                            <IconHistory24px class="icon--btn icon--btn--pre" />
                          </slot>Lịch sử rút tiền
                        </app-button>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-slot:content>
                  <div class="elearning-history__statistical">
                    <h5 class="mb-3 font-weight-semi-bold">Thống kê nhanh</h5>
                    <div class="row">
                      <div class="col-6 col-md-3">
                        <div class="item">
                          <p class="title">Hôm nay</p>
                          <span class="value">
                            <strong
                              class="text-primary"
                            >{{ today_revenue | numeralFormat("0,0") }} {{ CURRENCY }}</strong>
                          </span>
                        </div>
                      </div>
                      <div class="col-6 col-md-3">
                        <div class="item">
                          <p class="title">Tuần này</p>
                          <span class="value">
                            <strong
                              class="color-blue"
                            >{{ week_revenue | numeralFormat("0,0") }} {{ CURRENCY }}</strong>
                          </span>
                        </div>
                      </div>
                      <div class="col-6 col-md-3">
                        <div class="item">
                          <p class="title">Tháng này</p>
                          <span class="value">
                            <strong
                              class="color-yellow"
                            >{{ month_revenue | numeralFormat("0,0") }} {{ CURRENCY }}</strong>
                          </span>
                        </div>
                      </div>
                      <div class="col-6 col-md-3">
                        <div class="item">
                          <p class="title">Tháng trước</p>
                          <span class="value">
                            <strong>{{ last_month_revenue | numeralFormat("0,0") }} {{ CURRENCY }}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </sub-block-section>
            </template>
          </block-section>

          <block-section title="Chi tiết doanh thu">
            <template v-slot:content>
              <sub-block-section
                :title-cls="{ 'border-0': true }"
                :content-cls="{ 'px-0': true, 'pt-0': true }"
                bg-content-color="transparent"
                :outline="false"
              >
                <template v-slot:title>
                  <div class="row">
                    <div class="col-md-9">
                      <filter-form>
                        <div class="mb-2">
                          <span class="filter-form__title">Chọn khoảng thời gian</span>
                        </div>

                        <div class="d-flex filter-form__input-wrapper">
                          <div class="filter-form__item" style="min-width: 21rem;">
                            <app-range-calendar
                              :placeholder="'DD/MM/YYYY - DD/MM/YYYY'"
                              v-model="dateDefault"
                              value-type="YYYY-MM-DD"
                              bordered
                              @change="changeDate"
                            />
                            <!-- <app-date-picker
                              class="w-100"
                              popupClass="datepicker-range-v2"
                              v-model="dateDefault"
                              square
                              range
                              size="sm"
                              placeholder="DD/MM/YYYY - DD/MM/YYYY"
                              :shortcuts="DATE_SHORTCUT"
                              @input="changeDate"
                              value-type="YYYY-MM-DD"
                            > -->
                              <!--<template v-slot:icon-calendar>-->
                              <!--<IconCalendar />-->
                              <!--</template>-->
                            <!-- </app-date-picker> -->
                          </div>
                        </div>
                      </filter-form>
                    </div>
                    <div class="col-md-3 text-md-right">
                      <p class="font-weight-semi-bold mb-2">Tổng thực nhận</p>
                      <p
                        class="font-weight-bold h3"
                      >{{ revenue | numeralFormat("0,0") }} {{ CURRENCY }}</p>
                    </div>
                  </div>
                </template>

                <template v-slot:content>
                  <div>
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
                    >
                      <template v-slot:cell(cost)="{row}">
                        <td>{{ get(row, 'cost', '') | numeralFormat("0,0") }} {{ CURRENCY }}</td>
                      </template>
                      <template v-slot:cell(fee)="{row}">
                        <td class="text-center">{{ formatFee(get(row, 'fee', ''))}}%</td>
                      </template>
                      <template v-slot:cell(total)="{row}">
                        <td class="text-primary">{{ formatFee(get(row, 'total', '')) | numeralFormat("0,0") }} {{ CURRENCY }}</td>
                      </template>
                      <template v-slot:cell(timestamp)="{row}">
                        <td>{{ get(row, 'timestamp', '-') | moment("DD-MM-YYYY") }}</td>
                      </template>
                      <template v-slot:cell(elearning_name)="{row}">
                        <td>
                          <v-popover
                            trigger="hover"
                            popover-inner-class="tooltip-inner popover-inner dont-break-out"
                            popover-class="tooltip-account-info-table"
                          >
                            {{get(row, 'elearning_name',"") | truncStrFilter(30)}}
                            <template slot="popover">
                              {{get(row, 'elearning_name',"")}}
                            </template>
                          </v-popover>
                        </td>
                      </template>
                    </app-table>
                  </div>
                </template>
              </sub-block-section>
            </template>
          </block-section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconArrowLeft from "~/assets/svg/design-icons/arrow-left.svg?inline";
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide";

import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import numeral from "numeral";
import { number } from "yup";
import { CURRENCY } from "~/utils/config";
import IconHistory24px from '~/assets/svg/v2-icons/history_24px.svg?inline';
import { DATE_SHORTCUT } from "~/utils/config";
import moment from "moment"

export default {
  name: "E-learning",
  layout: "account-info",

  components: {
    IconArrowLeft,
    SchoolAccountSide,
    IconHistory24px
  },

  data() {
    return {
      CURRENCY: CURRENCY,
      DATE_SHORTCUT: DATE_SHORTCUT,
      balance: "",
      today_revenue: "",
      week_revenue: "",
      month_revenue: "",
      last_month_revenue: "",
      heads: [
        {
          name: "code",
          text: "Mã đơn hàng"
        },
        {
          name: "timestamp",
          text: "Thời gian"
        },
        {
          name: "customer",
          text: "Khách hàng"
        },
        {
          name: "cost",
          text: "Giá trị",
        },
        {
          name: "elearning_name",
          text: "Sản phẩm",
        },
        {
          name: "fee",
          text: "Phí GD"
        },
        {
          name: "total",
          text: "Thực nhận"
        }
      ],
      pagination: {},
      list: [],
      params: {
        from: "",
        to: "",
        size: "",
        page: ""
      },
      revenue: "",
      dateDefault: []
    };
  },
  created() {
    this.getDateSelect()
    this.fetchRevenue();
    this.fetchEarning();
  },
  watch: {
    revenueList: {
      handler: function() {
        this.balance = get(this, "revenueList.data.balance", "");
        this.today_revenue = get(this, "revenueList.data.today_revenue", "");
        this.week_revenue = get(this, "revenueList.data.week_revenue", "");
        this.month_revenue = get(this, "revenueList.data.month_revenue", "");
        this.last_month_revenue = get(
          this,
          "revenueList.data.last_month_revenue",
          ""
        );
      }
    },
    earningList: {
      handler: function() {
        this.pagination = get(this, "earningList.data.earnings.page", {});
        this.list = get(this, "earningList.data.earnings.content", []);
        this.revenue = get(this, "earningList.data.revenue", "");
      }
    }
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState("account", {
      revenueList: "revenueList"
    }),
    ...mapState("account", {
      earningList: "earningList"
    }),
    ...mapState("auth", ["token"]),
    filterPagination() {
      return {
        size:get(this,"earningList.data.earnings.page.size",10),
        total_pages:get(this,"earningList.data.earnings.page.totalPages",0),
        total_elements:get(this,"earningList.data.earnings.page.totalElements",0),
        first:get(this,"earningList.data.earnings.page.first",false),
        last:get(this,"earningList.data.earnings.page.last",false),
        number_of_elements:get(this,"earningList.data.earnings.page.numberOfElements",0),
        number:get(this,"earningList.data.earnings.page.number",0)
      };
    },
  },

  methods: {
    fetchRevenue() {
      const res = this.$store.dispatch(
        `account/${actionTypes.ACCOUNT_REVENUE.LIST}`
      );
    },
    fetchEarning() {
      const payload = {
        params: {
          to: this.params.to,
          from: this.params.from,
          size: this.params.size,
          page: this.params.page
        }
      };
      this.$store.dispatch(
        `account/${actionTypes.ACCOUNT_EARNING.LIST}`,
        payload
      );
    },
    onPageChange(e) {
      this.params.size = e.size;
      this.params.page = e.number + 1;
      this.fetchEarning();
    },
    formatFee(fee) {
      return numeral(fee).format("0");
    },
    changeDate(date) {
      this.params.from = date[0];
      this.params.to = date[1];
      this.fetchEarning();
    },
    getDateSelect(){
      const firstday = moment().startOf('month');
      const today = moment();
      this.dateDefault = [firstday,today];
      this.params.from = firstday.format("YYYY-MM-01");
      this.params.to = today.format("YYYY-MM-DD");
    },
    get,
    numeral
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-history.scss";
</style>