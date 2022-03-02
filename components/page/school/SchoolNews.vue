<template>
    <div class="school-news" id="news">
        <div class="school-news__title">Tin tức sự kiện</div>
        <div class="school-news__line"></div>

        <div class="school-news__content" v-if="get(this,'newsList.content.length',0)">
            <div class="row">
                <div class="col-12 col-md-4" v-for="(item, index) in get(this,'newsList.content',[])" :key="index">
                    <SchoolNewsItem :data="item"/>
                </div>
            </div>
        </div>

        <div class="school-news__btn text-center" v-if="get(this,'newsList.content.length',0)">
            <app-button
                class="text-white"
                size="md"
                color="primary"
                @click="getAllNews"
                >
                Xem tất cả
            </app-button>
        </div>
        <div v-else>
            Chưa có thông tin
        </div>
    </div>
</template>

<script>
import SchoolNewsItem from "~/components/page/school/SchoolNewsItem"

import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";

export default {
    data() {
        return {
            params:{
                organization_id : this.$route.params.id,
                size:3,
            }
        }
    },
    computed:{
        ...mapState("elearning/school/school-news", { newsList: "schoolNews" }),
    },
    methods:{
        getAllNews(){
            this.$router.push({query: { tab: 'news'}})
        },
        async fetchNewsList(){
    
            const data = this.params;
            await this.$store.dispatch(
            `elearning/school/school-news/${actionTypes.SCHOOL_NEWS.LIST}`,
                data
            );
            this.pageLoading = false;

        },
        get
    },
    created(){
        this.fetchNewsList();
    },
    components: {
        SchoolNewsItem
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/school/_school-news.scss";
</style>