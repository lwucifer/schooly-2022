<template>
    <div class="container">
        <div class="row wrap-notify-school">
            <div class="col-md-8">
                <SchoolNewsDetail 
                    v-if="isDetail"
                    :paramsCategory="params.category_id"
                />
                <div v-else>
                    <div class="intro-text-school-menu-side">{{titleNews}}</div>
                    <div v-if="pageLoading">
                        <VclList/>
                    </div>
                    <div v-else>
                        <div v-if="get(this,'list.length')">
                            <div class="row news-item-school" v-for="(item,index) in list" :key="index" @click="showDetailNews(item)">
                                <div class="col-md-4">
                                    <img :height="131" class="w-100" :src="get(item,'thumb','https://picsum.photos/218/131')">
                                </div>
                                <div class="col-md-8">
                                    <p class="title-notify">{{get(item,"title","")}}</p>
                                    <p class="text-sub my-2">{{get(item,"updated","") | moment("DD/MM/YYYY")}}</p>
                                    <p v-html="get(item,'short_desc','')"></p>
                                </div>
                            </div>
                            <app-pagination
                                :pagination="filterPagination"
                                @pagechange="pagechange"
                                class="mt-5"
                            />
                        </div>
                        <div v-else>
                            Chưa có thông tin
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <SchoolNewsMenuSide
                    @changeCategory="changeCategory"
                />
            </div>
        </div>
    </div>
</template>

<script>
import SchoolNewsMenuSide from "~/components/page/school/News/SchoolNewsMenuSide";
import SchoolNewsDetail from "~/components/page/school/News/SchoolNewsDetail"
import { VclList} from "vue-content-loading";

import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import {moment} from "moment";
import { getParamQuery } from "~/utils/common"
export default {
    components:{
        SchoolNewsMenuSide,
        SchoolNewsDetail,
        VclList
    },
    data(){
        return{
            isDetail:false,
            list:get(this,'newsList.content',[]),
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
                category_id:1,
                size:10,
                page:null
            },
            titleNews:'Tin tức mới',
            pageLoading:true
         }
    },
    
    watch:{
        newsList:{
            handler:function(){
                this.list = get(this,"newsList.content",[])
            }
        },
        '$route.query'(){
            this.checkParamsID()
        }
    },
    computed:{
        ...mapState("elearning/school/school-news", { newsList: "schoolNews" }),
        filterPagination(){
            this.pagination.total_pages = get(this,'newsList.total_pages','');
            this.pagination.size = get(this,'newsList.size','');
            this.pagination.total_elements = get(this,'newsList.total_elements','');
            this.pagination.first =  get(this,'newsList.first',0);
            this.pagination.last =  get(this,'newsList.last',0);
            this.pagination.number =  get(this,'newsList.number','');
            return this.pagination
        }
    },
    methods:{
        showDetailNews(item){
            //this.isDetail= true;
            this.$router.push({query: { tab: 'news',news_id: item.id}})
        },
        async fetchNewsList(){
    
            const data = this.params;
            await this.$store.dispatch(
            `elearning/school/school-news/${actionTypes.SCHOOL_NEWS.LIST}`,
                data
            );
            this.pageLoading = false;

        },
        changeCategory(item){
            this.$router.push({query: { tab: 'news'}})
            this.params.category_id = item.id;
            this.titleNews = item.name;
            this.params.size = 10;
            this.params.page = 1;
            this.pageLoading = true;
            this.fetchNewsList();
        },
        pagechange(val){
            this.params.page = val.number + 1;
            this.fetchNewsList();
        },
        checkParamsID(){
            const news_id = this.$route.query.news_id
            if(news_id){
                this.isDetail = true
            }else{
                this.isDetail = false
            }
        },
        get
    },
    async created(){
        await this.fetchNewsList();
        this.checkParamsID()
    }
}
</script>

<style lang="scss">
.news-item-school{
    cursor: pointer;
    margin-bottom: 3.5rem;
}
</style>