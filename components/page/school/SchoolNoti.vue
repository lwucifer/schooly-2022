<template>
    <div class="school-noti" id="notification">
        <div class="school-noti__title">Thông báo</div>
        <div class="school-noti__line"></div>

        <div class="school-noti__content" v-if="get(this,'announcements.content.length',0)">
            <div class="row">
                <div class="col-12 col-md-8">
                    <div v-for="(item, index) in get(this,'announcements.content',[])" :key="index" class="wrapper">
                        <SchoolNotiItem :data="item"/>
                    </div>
                    
                </div>

                <div class="col-12 col-md-4">
                    <div class="noti-bg">
                        <div class="noti-bg__img">
                            <img src="~assets/images/school/email.png" alt="">
                        </div>

                        <div class="noti-bg__text">
                            <n-link to="" class="text-white">{{ get(this,'announcementsOther.content[0].title',[]) }}</n-link>
                            <p>{{ get(this,'announcementsOther.content[0].updated',[]) | moment('DD/MM/YYYY') }}</p>
                        </div>

                        <div class="noti-bg__btn">
                            <app-button
                                size="md"
                                @click="getAllNotify"
                                class="text-white">Xem tất cả thông báo</app-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            Chưa có thông tin
        </div>
    </div>
</template>

<script>

import SchoolNotiItem from "~/components/page/school/SchoolNotiItem"

import { mapState, mapActions } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { moment } from "moment"
export default {
    components: {
        SchoolNotiItem
    },

    data () {
        return {
            dataFake: [
                {noti_title: 'Thông báo về học bổng của Nhật Bản dành cho cán bộ lãnh đạo trẻ', date: '20/05/2020'},
                {noti_title: 'Danh sách thí sinh đủ điều kiện xét tuyển kỳ xét tuyển viên chức (giáo viên) năm học 2017 - 2018 (đợt 2)', date: '20/05/2020'},
                {noti_title: 'Về tuyển sinh lớp ôn tập và thi cấp chứng chỉ Tin học Ứng dụng CNTT cơ bản', date: '20/05/2020'}
            ],
            params:{
                organization_id : this.$route.params.id,
                size:3,
                category_id:4
            }
        }
    },
    computed:{
        ...mapState("elearning/school/school-announcement", { announcements: "announcements", announcementsOther:"announcementsOther" }),
    },
    methods:{
        ...mapActions("elearning/school/school-announcement", ["schoolAnnouncementOther"]),
        getAllNotify(){
            this.$router.push({query: { tab: 'notify'}})
        },
        async fetchNotifyList(){
    
            const data = this.params;
            await this.$store.dispatch(
            `elearning/school/school-announcement/${actionTypes.SCHOOL_INFO.ANNOUNCEMENT}`,
                data
            );
            const data1 = {
                organization_id : this.$route.params.id,
                size:1,
                category_id:6
            }
            this.schoolAnnouncementOther(data1)

        },
        get
    },
    created(){
        this.fetchNotifyList();
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/school/_school-noti.scss";
</style>