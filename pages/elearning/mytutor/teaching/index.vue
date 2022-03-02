<template>
  <div class="container mytutor-teaching">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <MenuSideMyTutor :active="3"/>
      </div>
      <div class="col-md-9">
        <sub-block-section title="Lịch giảng dạy">
          <template v-slot:content>
            <div class="mytutor-teaching__content">
              <div class="d-flex">
                <div class="date-picker-item">
                  <span class="mr-3">Từ</span>
                  <app-date-picker
                    v-model="payload.start"
                    @input="changeDateStart"
                  />
                </div>
                <div class="mr-5">
                  <span class="mr-3">Đến</span>
                  <app-date-picker
                    v-model="payload.end"
                    @input="changeDateEnd"
                  />
                </div>
              </div>
              <div class="mt-4"
                v-for="(item,index) in convertScheduel"
                :key="index"
              >
                <ScheduleTable :sheduleData="item"/>
              </div>
            </div>
          </template>
        </sub-block-section>
      </div>
    </div>
  </div>
</template>

<script>
import ScheduleTable from "~/components/page/elearning/mytutor/teaching/ScheduleTable"
import MenuSideMyTutor from "~/components/page/elearning/mytutor/MenuSideMyTutor"
import { mapState, mapActions } from "vuex";
import { DAY_SECTION } from "~/utils/constants";
import {
  convertLocalTimeForTimetable,
  addDurationToUTCDate,
  getTodayDDD,
  isTodayInRangeDate
} from "~/utils/moment";
const moment = require('moment');
export default {
  components:{
    ScheduleTable,
    MenuSideMyTutor
  },
  data(){
    return{
      payload:{
        start: null,
        end : null
      }
    }
  },
  computed:{
    ...mapState("elearning/mytutor/teaching",["teachingSchedules"]),

    convertScheduel(){
      return this.teachingSchedules.map(item =>{
        const schedules = [];
        const listT = [];
        const times = {};
        const timeMorning = {};
        const timeAfternoon = {};
        const timeEvening = {};
        const currentDayInWeek = getTodayDDD();
        const todayInRange = isTodayInRangeDate(item.from_date, item.to_date);
        for (const s in item.schedules) {
          const arrTime = item.schedules[s].day_of_week;
          if(arrTime == item.schedules[s].day_of_week){
            listT[arrTime]= item.schedules[s]
          }
        }
        for(const a in listT){
          const start_time = convertLocalTimeForTimetable(listT[a].start);
          const end_time = convertLocalTimeForTimetable(listT[a].end);

          const checkWhichTimeInDay = this.checkWhichTimeInDay(end_time);
          const value = `${start_time} - ${end_time}`;
          if (checkWhichTimeInDay == DAY_SECTION.MORNING) {
            timeMorning[listT[a].day_of_week.toLowerCase()] = {
              time : value,
              ol_class: listT[a].ol_class,
              teacher: listT[a].teacher
            };
          } else if (checkWhichTimeInDay == DAY_SECTION.AFTERNOON) {
            timeAfternoon[listT[a].day_of_week.toLowerCase()] = {
              time : value,
              ol_class: listT[a].ol_class,
              teacher: listT[a].teacher
            };
          } else if (checkWhichTimeInDay == DAY_SECTION.EVENING) {
            timeEvening[listT[a].day_of_week.toLowerCase()] = {
              time : value,
              ol_class: listT[a].ol_class,
              teacher: listT[a].teacher
            };
          }
          timeMorning["day"] = DAY_SECTION.MORNING;
          timeAfternoon["day"] = DAY_SECTION.AFTERNOON;
          timeEvening["day"] = DAY_SECTION.EVENING;
    
          if (listT[a].day_of_week == currentDayInWeek && todayInRange) {
            timeMorning["today"] = "today";
            timeAfternoon["today"] = "today";
            timeEvening["today"] = "today";
          }
        }
        schedules.push(timeMorning);
        schedules.push(timeAfternoon);
        schedules.push(timeEvening);
        return {
          from_date: item.from,
          to_date: item.to,
          schedules: schedules
        };
      })
    }
  },

  methods:{
    ...mapActions("elearning/mytutor/teaching",["getTeachingSchedules"]),
    
    async fetchTeachingSchedule(){
      const payload = this.payload
      await this.getTeachingSchedules(payload)
    },

    checkWhichTimeInDay(time) {
      if (!time) return 1;
      const splits = time.split(":");
      const hh = parseInt(splits[0]);
      if (hh >= 0 && hh <= 12) {
        return DAY_SECTION.MORNING;
      } else if (hh > 12 && hh <= 18) {
        return DAY_SECTION.AFTERNOON;
      } else if (hh > 18 && hh <= 24) {
        return DAY_SECTION.EVENING;
      }
    },

    changeDateEnd(val){
      this.fetchTeachingSchedule()
    },
    changeDateStart(val){
      this.fetchTeachingSchedule()
    }
  },

  created(){
    this.fetchTeachingSchedule()
    this.payload.start = moment().startOf("week").format('DD/MM/YYYY');
    this.payload.end = moment().endOf("week").format('DD/MM/YYYY');
    console.log(this.payload,'ll')
  }
}
</script>

<style lang="scss">
.mytutor-teaching{
  &__content{
    .date-picker-item{
      margin-right: 5rem;
    }
  }
}
</style>