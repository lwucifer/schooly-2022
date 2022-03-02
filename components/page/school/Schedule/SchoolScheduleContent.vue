<template>
    <div class="container">
        <div class="row wrap-notify-school">
            <div class="col-md-8">
                <div v-if="!isDetail">
                    <div v-if="pageLoading">
                        <VclList/>
                    </div>
                    <div v-else>
                        <div class="intro-text-school-menu-side">Thời khóa biểu mới mới</div>
                        <div v-if="get(this,'timetablesList.content.length',0)">
                            <div class="row news-item-school" v-for="(item,index) in get(this,'timetablesList.content',[])" :key="index" @click="showDetailSchedule(item.id)">
                                <div class="col-md-4">
                                    <img :height="131" class="w-100" src="~assets/images/tmp/timetable.png">
                                </div>
                                <div class="col-md-8">
                                    <p class="title-notify">{{ get(item,'title','') }}</p>
                                    <p class="text-sub my-2">{{ get(item,'updated','') | moment('DD/MM/YYYY') }}</p>
                                </div>
                            </div>
                            <app-pagination
                                :pagination="filterPagination"
                                @pagechange="pagechange"
                                class="mt-5"
                            />
                        </div>
                        <div v-else>Chưa có thông tin</div>
                    </div>
                </div>
                <SchoolScheduleDetail v-else/>
            </div>
            <div class="col-md-4">
                <SchoolSchedileMenuSide/>
            </div>
        </div>
    </div>
</template>

<script>
import SchoolSchedileMenuSide from "~/components/page/school/Schedule/SchoolSchedileMenuSide"
import SchoolScheduleDetail from "~/components/page/school/Schedule/SchoolScheduleDetail"

import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import {moment} from "moment";
import { VclList} from "vue-content-loading";
export default {
    components:{
        SchoolSchedileMenuSide,
        SchoolScheduleDetail,
        VclList
    },
    data(){
        return{
            isDetail:false,
            pagination:{
                total_pages: 2,
                size: 10,
                total_elements: 20,
                first: 1,
                last: 0,
                number: 1
            },
            params:{
                organization_id : this.$route.params.id,
                size:10,
                page:null
            },
            pageLoading: true
        }
    },
    computed:{
        ...mapState("elearning/school/school-info", { timetablesList: "timetables" }),
        filterPagination(){
            this.pagination.total_pages = get(this,'timetablesList.total_pages','');
            this.pagination.size = get(this,'timetablesList.size','');
            this.pagination.total_elements = get(this,'timetablesList.total_elements','');
            this.pagination.first =  get(this,'timetablesList.first',0);
            this.pagination.last =  get(this,'timetablesList.last',0);
            this.pagination.number =  get(this,'timetablesList.number','');
            return this.pagination
        }
    },
    watch:{
        '$route.query'(){
            this.checkParamsID()
        }
    },
    created(){
        this.fetchTimeTableList();
        this.checkParamsID()
    },
    methods:{
        showDetailSchedule(id){
            this.$router.push({query: { tab: 'schedule',timetable_id : id}})
        },
        async fetchTimeTableList(){
            const data = this.params;
            await this.$store.dispatch(
            `elearning/school/school-info/${actionTypes.SCHOOL_INFO.TIMETABLE}`,
                data
            );
            this.pageLoading = false;

        },
        pagechange(val){
            this.params.page = val.number + 1;
            this.fetchTimeTableList();
        },
        checkParamsID(){
            const timetable_id = this.$route.query.timetable_id
            if(timetable_id){
                this.isDetail = true
            }else{
                this.isDetail = false
            }
        },
        get
    }
}
</script>

<style lang="scss">
.news-item-school{
    cursor: pointer;
    margin-bottom: 3.5rem;
}
</style>