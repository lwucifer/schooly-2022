<template>
  <div class="table_schedule">
      <h5 class="text-primary mb-4">
        Thời gian từ ngày  {{sheduleData.from_date}}  đến {{sheduleData.to_date}}
      </h5>
      <app-table :heads="convertedHeads" :data="sheduleData.schedules">
        <template v-slot:cell(day)="{ row }">
            <td v-if="row.day == 1" class="day">Sáng</td>
            <td v-else-if="row.day == 2" class="day">Chiều</td>
            <td v-else-if="row.day == 3" class="day">Tối</td>
        </template>
        <template v-slot:cell(mon)="{ row }">
            <td :class="checkToday('mon') && row.mon ? 'today' : ''">
                <v-popover trigger="hover">
                    <div>{{get(row,"mon.time","")}}</div>
                    <template slot="popover">
                        <div>
                            <p class="body-3 text-primary">{{get(row,"mon.ol_class.name","")}}</p>
                            <p>{{get(row,"mon.ol_class.participants","")}} Học sinh</p>
                            <p>{{get(row,"mon.ol_class.subject","")}}</p>
                        </div>
                    </template>
                </v-popover>
            </td>
        </template>
        <template v-slot:cell(tue)="{ row }">
            <td :class="checkToday('tue') && row.tue ? 'today' : ''">
                <v-popover trigger="hover">
                    <div>{{get(row,"tue.time","")}}</div>
                    <template slot="popover">
                        <div>
                            <p class="body-3 text-primary">{{get(row,"tue.ol_class.name","")}}</p>
                            <p>{{get(row,"tue.ol_class.participants","")}} Học sinh</p>
                            <p>{{get(row,"tue.ol_class.subject","")}}</p>
                        </div>
                    </template>
                </v-popover>
            </td>
        </template>
        <template v-slot:cell(wed)="{ row }">
            <td :class="checkToday('wed') && row.wed ? 'today' : ''">
                <v-popover trigger="hover">
                    <div>{{get(row,"wed.time","")}}</div>
                    <template slot="popover">
                        <div>
                            <p class="body-3 text-primary">{{get(row,"wed.ol_class.name","")}}</p>
                            <p>{{get(row,"wed.ol_class.participants","")}} Học sinh</p>
                            <p>{{get(row,"wed.ol_class.subject","")}}</p>
                        </div>
                    </template>
                </v-popover>
            </td>
        </template>
        <template v-slot:cell(thu)="{ row }">
            <td :class="checkToday('thu') && row.thu ? 'today' : ''">
                <v-popover trigger="hover">
                    <div>{{get(row,"thu.time","")}}</div>
                    <template slot="popover">
                        <div>
                            <p class="body-3 text-primary">{{get(row,"thu.ol_class.name","")}}</p>
                            <p>{{get(row,"thu.ol_class.participants","")}} Học sinh</p>
                            <p>{{get(row,"thu.ol_class.subject","")}}</p>
                        </div>
                    </template>
                </v-popover>
            </td>
        </template>
        <template v-slot:cell(fri)="{ row }">
            <td :class="checkToday('fri') && row.fri ? 'today' : ''">
                <v-popover trigger="hover">
                    <div>{{get(row,"fri.time","")}}</div>
                    <template slot="popover">
                        <div>
                            <p class="body-3 text-primary">{{get(row,"fri.ol_class.name","")}}</p>
                            <p>{{get(row,"fri.ol_class.participants","")}} Học sinh</p>
                            <p>{{get(row,"fri.ol_class.subject","")}}</p>
                        </div>
                    </template>
                </v-popover>
            </td>
        </template>
        <template v-slot:cell(sat)="{ row }">
            <td :class="checkToday('sat') && row.sat ? 'today' : ''">
                <v-popover trigger="hover">
                    <div>{{get(row,"sat.time","")}}</div>
                    <template slot="popover">
                        <div>
                            <p class="body-3 text-primary">{{get(row,"sat.ol_class.name","")}}</p>
                            <p>{{get(row,"sat.ol_class.participants","")}} Học sinh</p>
                            <p>{{get(row,"sat.ol_class.subject","")}}</p>
                        </div>
                    </template>
                </v-popover>
            </td>
        </template>
        <template v-slot:cell(sun)="{ row }">
            <td :class="checkToday('sun') && row.sun ? 'today' : ''">
                <v-popover trigger="hover">
                    <div>{{get(row,"sun.time","")}}</div>
                    <template slot="popover">
                        <div>
                            <p class="body-3 text-primary">{{get(row,"sun.ol_class.name","")}}</p>
                            <p>{{get(row,"sun.ol_class.participants","")}} Học sinh</p>
                            <p>{{get(row,"sun.ol_class.subject","")}}</p>
                        </div>
                    </template>
                </v-popover>
            </td>
        </template>
      </app-table>
  </div>
</template>

<script>
import { getTodayDDD } from "~/utils/moment";
import { get } from "lodash"
export default {
    data() {
    return {
      list: [
        {
            day: 1,
            today: "today",
            sat: "11:40 - 13:10",
            mon: "11:40 - 13:10",
        },
        {
            day: 2,
            fri: "11:40 - 13:10",
            mon: "11:40 - 13:10",
            today: "today",
            tue: "11:40 - 13:10",
            wed: "11:40 - 13:10"
        },
        {
            day: 3,
            sun: "11:40 - 13:10",
            thu: "11:40 - 13:10",
            today: "today"
        }
      ],
      heads: [
        {
          name: "day",
          text: ""
        },
        {
          name: "mon",
          text: "Thứ 2"
        },

        {
          name: "tue",
          text: "Thứ 3"
        },
        {
          name: "wed",
          text: "Thứ 4"
        },
        {
          name: "thu",
          text: "Thứ 5"
        },
        {
          name: "fri",
          text: "Thứ 6"
        },
        {
          name: "sat",
          text: "Thứ 7"
        },
        {
          name: "sun",
          text: "Chủ nhật"
        }
      ]
    };
  },
  props:{
    sheduleData:{
      type: Object,
      default:()=>{}
    }
  },
  computed: {
    convertedHeads() {
      const currentDayInWeek = getTodayDDD();

      return this.heads.map(h => {
        return {
          ...h,
          class: h.name == currentDayInWeek ? "today" : null
        };
      });
    }
  },
  created(){
    
  },
  methods:{
    checkToday(val){
        const st = this.convertedHeads.filter(item=>
             item.class == 'today'
        )
        return st[0].name == val
    },
    get
  }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/olclass/time-table.scss";
.today {
  background-color: rgba(#d50000, 0.2) !important;
  border: 1px solid #EEEEEE;
  color: #d50000;
}
</style>