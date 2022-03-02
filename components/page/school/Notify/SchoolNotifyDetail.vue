<template>
  <div v-if="pageLoading">
    <VclList/>
  </div>
  <div v-else>
        <h4>{{ get(this,"anouncementListDetail.title","") }}</h4>
        <p class="text-sub my-2">{{ get(this,"anouncementListDetail.updated","") | moment('DD/MM/YYYY')}}</p>
        <div class="mt-5">
            <strong v-if="get(this,'anouncementListDetail.attachments','')">Tệp đính kèm: 
                <span
                    v-for="(file,index) in get(this,'anouncementListDetail.attachments','')"
                    :key="index"
                >
                    <a 
                    :href="get(file,'url','')"
                    class="mr-2"
                    >
                        {{get(file,'name','')}}
                    </a>
                </span>
            </strong>
        </div>
        <div style="padding: 1.5rem 0 3.5rem" v-html="get(this,'anouncementListDetail.content','')">
        </div>
        <div class="notify-other">
            <div class="intro-text-school-menu-side" style="font-size: 16px;">Thông báo khác</div>
            <div 
                class="d-flex align-items-center mb-4 school-news-detail" 
                v-for="(item,index) in filterOtherAnnouncements ? filterOtherAnnouncements : []" 
                :key="index"
                @click="getDetailAnnouncement(item.id)"
            >
                <IconEllipse2 class="mr-3"/>
                <span class="" v-html="get(item,'title','')"></span>
                <span class="ml-auto text-sub">{{get(item,'updated','') | moment('DD.MM.YYYYY')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import IconEllipse2 from '~/assets/svg/icons/ellipse2.svg?inline';
import { VclList} from "vue-content-loading";
import { mapState, mapActions } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get, cloneDeep, filter } from "lodash";
import {moment} from "moment";
import { getParamQuery } from "~/utils/common"
export default {
    components:{
        IconEllipse2,
        VclList
    },
    data(){
        return{
            params:{
                organization_id : this.$route.params.id,
                category_id:4,
                size:6,
                page:1
            },
            pageLoading:true
        }
    },
    props:{
        paramsCategory:{
            type: Number,
            default: 4
        }
    },
    watch:{
       '$route.query.announcement_id'(){
            if(get(this,"newsListDetail.data.id","") !=this.$route.query.announcement_id){
                this.checkAnouncementId();
            }
        }
    },
    computed:{
        ...mapState("elearning/school/school-announcement", { anouncementListDetail: "announcementDetail",
            announcementOtherList:"announcementsOther"}),
        filterOtherAnnouncements(){
            const arr = cloneDeep(this.announcementOtherList.content)
            const rs = filter(arr,(el)=>{ return el.id != this.$route.query.announcement_id })
            if(rs.length == 6){
                rs.pop()
                return rs
            }
            return rs
        },
        paramsAnouncementOther(){
            this.params.category_id = this.paramsCategory;
            return this.params;
        }
        
    },
    methods:{
        ...mapActions("elearning/school/school-announcement", ["schoolAnnouncementOther"]),
        async fetchAnouncementDetail(id){
            this.pageLoading = true;
            const data = { id : id };
            const rs = await this.$store.dispatch(
            `elearning/school/school-announcement/${actionTypes.SCHOOL_INFO.ANNOUNCEMENT_DETAIL}`,
                data
            );
            this.pageLoading = false;
        },
        async checkAnouncementId(){
            let announcement_id = this.$route.query.announcement_id;
            if(announcement_id){
                await this.fetchAnouncementDetail(announcement_id)
            }else{
                console.log('fail')
            }
        },
        async fectAnouncementOther(){
            const data = this.paramsAnouncementOther;
            await this.schoolAnnouncementOther(data)
            console.log('data',data)
        },
        getDetailAnnouncement(id){
            this.$router.push({query: { tab: 'notify',announcement_id: id}})
        },
        get
    },
    async created(){
        await this.checkAnouncementId();
        await this.fectAnouncementOther()
    }
}
</script>

<style lang="scss">
.school-news-detail{
    cursor: pointer;
}
</style>