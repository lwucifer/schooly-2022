<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <MyCourseSide :active="1" />
      </div>
      <div class="col-md-9">
        <sub-block-section title="Tổng quan" class="mb-4">
          <template v-slot:content>
            <div class="row wrap-general-study-space">
              <div class="col-md-6 item">
                <div class="top">
                  <div class="d-flex">
                    <span>Số bài giảng đã tham gia</span>
                    <IconBookOpen1 class="ml-auto" />
                  </div>
                  <h1>{{get(overview, 'lectures', 0)}}</h1>
                </div>
              </div>
              <div class="col-md-6 item">
                <div class="top">
                  <div class="d-flex">
                    <span>Số khóa học đã tham gia</span>
                    <IconData class="ml-auto" />
                  </div>
                  <h1>{{get(overview, 'courses', 0)}}</h1>
                </div>
              </div>
              <div class="col-md-6 item">
                <div class="top">
                  <div class="d-flex">
                    <span>Tỷ lệ hoàn thành các bài giảng & khóa học</span>
                    <IconList1 class="ml-auto" />
                  </div>
                  <h1>{{get(overview, 'complete_rate', 0)}}%</h1>
                </div>
              </div>
              <div class="col-md-6 item">
                <div class="top">
                  <div class="d-flex">
                    <span>Điểm trung bình</span>
                    <IconGrade1 class="ml-auto" />
                  </div>
                  <h1>{{numeral(get(overview, 'medium_core', 0)).format('0,0.0')}}</h1>
                </div>
              </div>
            </div>
          </template>
        </sub-block-section>
        <ScheduleToday @changeDateInWeek="changeDateInWeek" />
        <GeneralExamExpiry />
      </div>
    </div>
  </div>
</template>

<script>
import IconBookOpen1 from "~/assets/svg/icons/book-open1.svg?inline";
import IconData from "~/assets/svg/icons/data.svg?inline";
import IconList1 from "~/assets/svg/icons/list1.svg?inline";
import IconGrade1 from "~/assets/svg/icons/grade1.svg?inline";
import GeneralExamExpiry from "~/components/page/elearning/mycourses/GeneralExamExpiry";
import StudySpaceAsideMenu from "~/components/page/elearning/mycourses/StudySpaceAsideMenu";
import ScheduleToday from "~/components/page/elearning/mycourses/ScheduleToday";
import moment from "moment";
import MyCourseSide from "~/components/page/elearning/mycourses/MyCourseSide";
import * as actionTypes from "../../../utils/action-types";
import { mapState } from "vuex";
import { get } from "lodash";
const STORE_OVERVIEW = "elearning/study/study-overview";
import numeral from 'numeral'

export default {
  components: {
    IconBookOpen1,
    IconData,
    IconList1,
    IconGrade1,
    GeneralExamExpiry,
    StudySpaceAsideMenu,
    ScheduleToday,
    MyCourseSide
  },

  data() {
    return {
      toDate: new Date()
    };
  },

  computed: {
    ...mapState(STORE_OVERVIEW, ["overview"])
  },

  methods: {
    get,
    numeral,
    // getWeek(){
    //     const s = moment("2020-05-22");
    //     const tuesday = moment("2020-05-20").day("2")
    //     console.log('tuesday.format', tuesday.format('D').toString())
    //     for(let i=1;i<7;i++){
    //          const tuesday = moment("2020-05-20").day(i.toString())
    //          console.log(tuesday.toString())
    //     }
    // },
    getData() {
      this.$store.dispatch(
        `${STORE_OVERVIEW}/${actionTypes.ELEARNING_STURY_OVERVIEW.LIST}`
      );
      this.$store.dispatch(
        `${STORE_OVERVIEW}/${actionTypes.ELEARNING_STURY_OVERVIEW.TIME_TABLE}`,
        {
          from: moment(this.toDate)
            .format("YYYY-MM-DD 00:00:00")
            .toString(),
          to: moment(this.toDate)
            .format("YYYY-MM-DD 23:59:59")
            .toString()
        }
      );
      this.$store.dispatch(
        `${STORE_OVERVIEW}/${actionTypes.ELEARNING_STURY_OVERVIEW.DEADLINE}`
      );
    },
    changeDateInWeek(date) {
      console.log("changeDateInWeek index", date);
      this.toDate = date;
      this.$store.dispatch(
        `${STORE_OVERVIEW}/${actionTypes.ELEARNING_STURY_OVERVIEW.TIME_TABLE}`,
        {
          from: moment(this.toDate)
            .format("YYYY-MM-DD 00:00:00")
            .toString(),
          to: moment(this.toDate)
            .format("YYYY-MM-DD 23:59:59")
            .toString()
        }
      );
    }
  },
  created() {
    // this.getWeek();
    this.getData();
  },
  mounted() {
    // this.getData();
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-my-courses-general.scss";
</style>