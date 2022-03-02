<template>
  <div class="container">
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :group=1 :active=1 />
      </div>
      <div class="col-md-9">
        <h5 class="page-title">
          Tổng quan
        </h5>
        <div class="elearning-manager">
          <div class="box22">
            <div class="elearning-manager__dashboard-filter">
              <h6>Thống kê</h6>
              <!--<app-date-picker-->
                <!--class=""-->
                <!--v-model="filterDate"-->
                <!--square-->
                <!--range-->
                <!--size="sm"-->
                <!--placeholder="Chọn khoảng thời gian"-->
                <!--:shortcuts="DATE_SHORTCUT"-->
                <!--@input="handlerChangeDate"-->
                <!--valueFormat="DD/MM/YYYY"-->
              <!--&gt;-->
              <!--</app-date-picker>-->
              <!--<app-date-picker label="Chọn khoảng thời gian" v-model="filterDate" size="sm"/>-->
            </div>
            <div class="elearning-manager__dashboard mt-15">
              <div class="row row-space-5">
                <div class="col-md-6 item">
                  <div class="">
                    <div class="top">
                      <span>Số bài giảng</span>
                      <IconBook3 />
                    </div>
                    <strong>{{teacherInfo.total_lectures}}</strong>
                  </div>
                </div>
                <div class="col-md-6 item">
                  <div class="">
                    <div class="top">
                      <span>Số khóa học</span>
                      <IconData/>
                    </div>
                    <strong>{{teacherInfo.total_courses}}</strong>
                  </div>
                </div>
                <div class="col-md-6 item">
                  <div class="">
                    <div class="top">
                      <span>Số học sinh tham gia</span>
                      <IconUsers2 />
                    </div>
                    <strong>{{teacherInfo.participants}}</strong>
                  </div>
                </div>
                <div class="col-md-6 item">
                  <div class="">
                    <div class="top">
                      <span>Điểm đánh giá giáo viên</span>
                      <IconStar2 />
                    </div>
                  <strong>{{teacherInfo.voting_rate | numeralFormat('0.0') }}/5</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box22 mt-4">        
            <div class="elearning-manager__dashboard-filter">
              <h6>Doanh thu</h6>
              <!--<app-date-picker label="Chọn khoảng thời gian" v-model="filterDate" size="sm"/>-->
            </div>
            <div class="elearning-manager__dashboard elearning-manager__revenue mt-15 text-center">
              <div class="revenue">
                {{ totalRevenue | numeralFormat }} VNĐ
              </div>
              <div class="chart">
                  <GChart
                    type="ColumnChart"
                    :data="chartData"
                    :options="chartOptions"
                  />
              </div>
              <n-link class="color-primary" :to="'/temp'"/>
            </div>
          </div>
          <div class="box22 mt-4">        
            <div class="elearning-manager__dashboard-filter">
              <h6>Bài giảng và khóa học nổi bật</h6>
              <!--<app-date-picker label="Chọn khoảng thời gian" v-model="filterDate" size="sm"/>-->
            </div>
            <div class="elearning-manager__dashboard elearning-manager__revenue mt-15">
              <app-table
                :heads="tableHeads"
                :data="highlightElearnings"
                :need-pagination="false"
              >
                <template v-slot:cell(rate)="{row}">
                  <td>
                    <div class="nowrap">
                      <app-stars
                        class="d-inline-block"
                        :stars="get(row, 'rate', 0.0)"
                        :size="13"
                      />
                      <span class="text-dark font-weight-bold">{{ get(row, 'rate', 0.0) }}</span>
                    </div>
                  </td>
                </template>
              </app-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import IconCalendar from "~/assets/svg/icons/calendar.svg?inline";
import IconBook from "~/assets/svg/icons/book.svg?inline";
import IconDollarAlt from "~/assets/svg/design-icons/dollar-alt.svg?inline";
import IconChartLine from "~/assets/svg/design-icons/chart-line.svg?inline";
import IconUserUser from "~/assets/svg/icons/user-user.svg?inline";
import IconStar2 from "~/assets/svg/icons/star2.svg?inline";
import IconUsers2 from "~/assets/svg/icons/users2.svg?inline";
import IconBook3 from "~/assets/svg/icons/book3.svg?inline";
import IconData from "~/assets/svg/icons/data.svg?inline";

import { GChart } from 'vue-google-charts'

import { mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { useEffect, initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";
import { DATE_SHORTCUT } from "~/utils/config";
import { numeralFormat } from "~/plugins/filters";

const STORE_NAMESPACE = "elearning/teaching/summary";

export default {
  layout: "manage",
  name: "E-learning",

  components: {
    ElearningManagerSide,
    IconUserUser,
    IconBook,
    IconCalendar,
    IconDollarAlt,
    IconChartLine,
    IconStar2,
    IconUsers2,
    IconBook3,
    IconData,
    GChart
  },
  async fetch({ params, query, store, route }) {
    const userId = store.state.auth.token ? store.state.auth.token.id : "";
    const room_id = route.params.id;
    await Promise.all([
      store.dispatch(`elearning/teaching/statistic/revenue/${actionTypes.TEACHING_CHART_STATISTIC_REVENUE.INFO}`),
      store.dispatch(`elearning/teaching/statistic/highlight-els/${actionTypes.TEACHING_CHART_STATISTIC_HIGHLIGHT_ELS.LIST}`),
    ]);
  },
  data() {
    return {
      chartOptions: {
        chart: {
          title: null,
          subtitle: null,
        },
        colors: ['#37A000', '#d95f02', '#7570b3'],
        backgroundColor: {
          fill: "#0000"
        },
        legend: {position: 'none'},
        // width: 900,
        height: 400
      },
      filterDate: null,
      timeSelect1: {
        value: null,
        text: "Toàn thời gian"
      },
      timeSelect2: {
        value: null,
        text: "Toàn thời gian"
      },
      times: [
        {
          value: null,
          text: "Toàn thời gian"
        },
        {
          value: "year",
          text: "Năm"
        },
        {
          value: "month",
          text: "Tháng"
        },
        {
          value: "week",
          text: "Tuần"
        },
        {
          value: "day",
          text: "Trong ngày"
        }
      ],
      teacherInfo: {
        total_lectures: 0,
        total_courses: 0,
        voting_rate: 0,
        participants: 0,
        revenue: 0,
      },
      DATE_SHORTCUT: DATE_SHORTCUT,
      tableHeads: [
        {
          name: "name",
          text: "Tiêu đề",
        },
        {
          name: "views",
          text: "Lượt xem",
        },
        {
          name: "priceFormat",
          text: "Học phí",
        },
        {
          name: "rateFormat",
          text: "Đánh giá",
        },
      ],
    };
  },

  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState(STORE_NAMESPACE, {
      stateTeaching: "teachingInfo"
    }),
    ...mapState('elearning/teaching/statistic/revenue', {
      revenueChart: "revenueChart"
    }),
    ...mapState('elearning/teaching/statistic/highlight-els', [
      "elearnings",
    ]),
    chartData() {
      let tmp = [
        ['Year', '']
      ]
      const dataLg = this.revenueChart.length
      let yearTmp = null
      for (let i = 0; i < dataLg; i++) {
        const revenueTmp = this.revenueChart[i]
        let chartItem
        if (yearTmp != revenueTmp.year) {
          yearTmp = revenueTmp.year
          chartItem = [
            `${revenueTmp.month}/${revenueTmp.year}`,
            revenueTmp.revenue
          ]
        } else {
          chartItem = [revenueTmp.month, revenueTmp.revenue]
        }
        tmp.push(chartItem)
      }
      return tmp
    },
    totalRevenue() {
      let total = 0
      const dataLg = this.revenueChart.length
      for (let i = 0; i < dataLg; i++) {
        const revenueTmp = this.revenueChart[i]
        total+= revenueTmp.revenue
      }
      return total
    },
    highlightElearnings() {
      return this.elearnings.map(el => {
        return {
          ...el,
          priceFormat: numeralFormat(el.price, "0,0"),
          rateFormat: numeralFormat(el.rate, "0,0.0"),
        }
      })
    }
  },

  methods: {
    handleChangedTime(select) {
      this.getSummary(select);
    },

    addZero(e) {
      return parseInt(e) > 9 ? e : '0' + e;
    },

    async getSummary(select = null) {
      try {
        this.loading = true;
        const today = new Date();
        let from_date;
        let fromdate;
        let time = select == 1 ? this.timeSelect1.value : this.timeSelect2.value;
        switch (time) {
          case 'day':
            fromdate = new Date(today.getTime() - 24*60*60*1000);
            from_date = fromdate.getFullYear()+'-'+ 
                        this.addZero((fromdate.getMonth()+1))+'-'+
                        this.addZero(fromdate.getDate());
            break;
          case 'week':
            fromdate = new Date(today.getTime() - 7*24*60*60*1000);
            from_date = fromdate.getFullYear()+'-'+
                        this.addZero((fromdate.getMonth()+1))+'-'+
                        this.addZero(fromdate.getDate());
            break;
          case 'month':
            from_date = today.getFullYear()+'-'+
                        this.addZero(today.getMonth())+'-'+
                        this.addZero(today.getDate());
            break;
          case 'year':
            from_date = (today.getFullYear()-1)+'-'+
                        this.addZero((today.getMonth()+1))+'-'+ 
                        this.addZero(today.getDate());
            break;
        }
        const to_date = today.getFullYear()+'-'+
                        this.addZero((today.getMonth()+1))+'-'+
                        this.addZero(today.getDate());
        let params = {};
        if (from_date) {
          params = {
            from_date: from_date,
            to_date: to_date,
          };
        }

        await this.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.TEACHING_SUMMARY.INFO}`,
          params
        );
        if (this.stateTeaching) {
          if (select ==  1) {
            this.teacherInfo.participants = this.stateTeaching.participants
          } else if (select ==  2) {
            this.teacherInfo.revenue = this.stateTeaching.revenue
          } else {
            this.teacherInfo = {...this.stateTeaching}
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    handlerChangeDate(date){
      console.log('change date: ', date)
      // this.params.from = date[0];
      // this.params.to = date[1];
      // this.fetchWithdrawals();
    },
    get
  },

  created() {
    this.getSummary();
  },
  mounted() {
    const breadcrumb = [
      {
        title: 'Quản lý E-learning',
        to: '/elearning'
      },
      {
        title: 'Tổng quan',
        to: '/elearning/manager'
      },
    ]
    initBreadcrumb(this, breadcrumb);
    initPageTitle(this, createPageTitle('Quản lý Elearning'));
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-history.scss";
@import "~/assets/scss/components/elearning/manager/_elearning-manager.scss";
</style>