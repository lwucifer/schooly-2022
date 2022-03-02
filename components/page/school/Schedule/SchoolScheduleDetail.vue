<template>
  <div>
    <div v-if="pageLoading">
        <VclList/>
    </div>
    <div v-else>
        <h4>{{ get(this,'timetableDetail.title') }}</h4>
        <p class="text-sub my-2">{{ get(this,'timetableDetail.updated') | moment('DD/MM/YYYY') }}</p>
        <strong>Tệp đánh kèm:
            <span 
                v-for="(t_item,index) in get(this,'timetableDetail.attachments')"
                :key="index"
                class="mr-2 d-block"
            >
                <a :href="get(t_item,'url')">{{get(t_item,'name')}}</a>
            </span>
        </strong>
        <div class="py-4">
            <div v-html="get(this,'timetableDetail.content')"></div>
            <img  class="w-100 mt-4" :src="get(this,'timetableDetail.preview')">
        </div>
        <div class="notify-other">
            <div class="intro-text-school-menu-side" style="font-size: 16px;">Thời khóa biểu khác</div>
            <div 
                class="d-flex align-items-center mb-4 school-news-detail" 
                v-for="(item,index) in filterOtherTabletime ? filterOtherTabletime : []" 
                :key="index"
                @click="getDetailTimeTable(item.id)"
            >
                <IconEllipse2 class="mr-3"/>
                <span class="">{{ get(item,'title') }}</span>
                <span class="ml-auto text-sub">{{ get(item,'updated') | moment('DD.MM.YYYY') }}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import IconEllipse2 from '~/assets/svg/icons/ellipse2.svg?inline';

import { mapState, mapActions } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get, cloneDeep, filter } from "lodash";
import {moment} from "moment";
import { VclList} from "vue-content-loading";
export default {
    components:{
        IconEllipse2,
        VclList
    },
    data(){
        return{
            params:{
                organization_id : this.$route.params.id,
                size:5,
                page:1
            },
            pageLoading: true
        }
    },
    watch:{
       '$route.query.timetable_id'(){
            if(get(this,"timetableDetail.data.id","") !=this.$route.query.timetable_id){
                this.pageLoading = true;
                this.checkTimeTableId();
            }
        }
    },
    computed:{
        ...mapState("elearning/school/school-schedule", { timetableDetail: "timetableDetail",timetablesOther:"timetablesOther"}),
        filterOtherTabletime(){
            const arr = cloneDeep(this.timetablesOther.content)
            const rs = filter(arr,(el)=>{ return el.id != this.$route.query.timetable_id })
            return rs
        },
    },
    methods:{
        ...mapActions("elearning/school/school-schedule", ["timeTableOtherList"]),
        async fetchTimeTableDetail(id){
            const data = { id : id };
            const rs = await this.$store.dispatch(
            `elearning/school/school-schedule/${actionTypes.SCHOOL_INFO.TIMETABLE_DETAIL}`,
                data
            );
        },
        async checkTimeTableId(){
            let timetable_id = this.$route.query.timetable_id;
            if(timetable_id){
                await this.fetchTimeTableDetail(timetable_id)
                this.pageLoading = false;
            }else{
                console.log('fail')
            }
        },
        async fecthTimeTableOther(){
            const data = this.params;
            await this.timeTableOtherList(data)
            console.log('data',data)
        },
        getDetailTimeTable(id){
            this.$router.push({query: { tab: 'schedule',timetable_id: id}})
        },
        get
    },
    created(){
        this.checkTimeTableId();
        this.fecthTimeTableOther();
    }
}
</script>

<style>

</style>