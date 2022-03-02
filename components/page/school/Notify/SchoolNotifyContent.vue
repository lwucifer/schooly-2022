<template>
  <div class="container">
      <div class="row wrap-notify-school">
        <div class="col-md-8">
            <div v-if="!isDetail">
                <div class="intro-text-school-menu-side">{{titleAnnouncement}}</div>
                <div v-if="pageLoading">
                    <VclList/>
                </div>
                <div v-else>
                    <div v-if="get(this,'announcementsList.content.length',0)">
                        <div 
                            class="notify-item-school" 
                            v-for="(item,index) in get(this,'announcementsList.content',[])" 
                            :key="index" 
                            @click="showDetailNotify(item.id)"
                        >
                            <div class="circle-background">
                                <IconEmail24px class="fill-primary"/>
                            </div>
                            <div>
                                <p class="title-notify">{{ get(item,'title','') }}</p>
                                <p class="short-desc-notify-school" v-html="get(item,'short_desc','')"></p>
                                <p class="text-sub">{{ get(item,'updated','') | moment('DD/MM/YYYY')}}</p>
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
            <SchoolNotifyDetail
                 v-else
                 :paramsCategory="params.category_id"
             />
        </div>
        <div class="col-md-4">
            <SchoolMenuSideNotify
                @changeCategory="changeCategory"
            />
        </div>
    </div>
  </div>
</template>

<script>
import SchoolMenuSideNotify from "~/components/page/school/Notify/SchoolMenuSideNotify"
import IconEmail24px from '~/assets/svg/v2-icons/email_24px.svg?inline';
import IconEllipse2 from '~/assets/svg/icons/ellipse2.svg?inline';
import SchoolNotifyDetail from "~/components/page/school/Notify/SchoolNotifyDetail"

import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import {moment} from "moment";
import { VclList} from "vue-content-loading";
export default {
    components:{
        SchoolMenuSideNotify,
        IconEmail24px,
        IconEllipse2,
        SchoolNotifyDetail,
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
                category_id:4,
                size:10,
                page:null

            },
            titleAnnouncement:'Thông báo chung',
            pageLoading: true
        }
    },
    watch:{
        '$route.query'(){
            this.checkParamsID()
        }
    },
    computed:{
        ...mapState("elearning/school/school-announcement", { announcementsList: "announcements" }),
        filterPagination(){
            this.pagination.total_pages = get(this,'announcementsList.total_pages','');
            this.pagination.size = get(this,'announcementsList.size','');
            this.pagination.total_elements = get(this,'announcementsList.total_elements','');
            this.pagination.first =  get(this,'announcementsList.first',0);
            this.pagination.last =  get(this,'announcementsList.last',0);
            this.pagination.number =  get(this,'announcementsList.number','');
            return this.pagination
        }
    },
    created(){
        this.fetchNotifyList();
        this.checkParamsID();
    },
    methods:{
        showDetailNotify(id){
            this.$router.push({query: { tab: 'notify',announcement_id : id}})
        },
        async fetchNotifyList(){
            const data = this.params;
            await this.$store.dispatch(
            `elearning/school/school-announcement/${actionTypes.SCHOOL_INFO.ANNOUNCEMENT}`,
                data
            );
            this.pageLoading = false;

        },
        changeCategory(val){
            this.$router.push({query: { tab: 'notify'}})
            this.params.category_id = val.id;
            this.titleAnnouncement = val.name;
            this.params.size = 10;
            this.params.page = 1;
            this.pageLoading = true;
            this.fetchNotifyList();
        },
        pagechange(val){
            this.params.page = val.number + 1;
            this.fetchNotifyList();
        },
        checkParamsID(){
            const announcement_id = this.$route.query.announcement_id
            if(announcement_id){
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
@import "~assets/scss/components/school/_notify-school.scss";
</style>