<template>
    <div class="container student-profile">
        <div v-if="pageLoading" class="student-profile__overview mb-3">
            <div class="bg-white px-3"><VclFacebook :height="100"/></div>
        </div>
        
        <div v-else class="student-profile__overview">
            <ProfileHead :info="student"/>
        </div>
        
        <!--slide-->
        <div v-if="pageLoading" class="container">
            <div class="row">
                <div v-for="i in 4" :key="i" class="col-md-3 mb-6">
                    <div class="bg-white py-6 px-3">
                        <VclList/>
                    </div>
                </div>
            </div>
        </div>
        <ProfileSliderTab
          v-else
          :items="get(elearnings, 'content', [])"
          :name="`Bài học và khóa giảng đã tham gia (${get(elearnings, 'page.total_elements', 0)})`"
        />
    </div>
</template>

<script>
    import ProfileHead from "~/components/page/profile/student/ProfileHead";
    import ProfileSliderTab from "~/components/page/profile/ProfileSliderTab";
    import CourseItem2 from "~/components/page/course/CourseItem2";
    import {VclFacebook, VclList} from "vue-content-loading";
    import {mapState} from "vuex";
    import * as actionTypes from "~/utils/action-types";
    import {get} from "lodash"
    
    export default {
        data() {
            return {
                student: {
                    "id": "5383a2b3-3392-4e24-8f50-160d013c5ca4",
                    "name": "Trần Đức Nam",
                    "avatar": {
                        "high": "https://s3.cloud.cmctelecom.vn/dev-image-schoolly/avatar/48/high/3dbad727-8c01-48d7-9126-2576b9432557.png",
                        "medium": "https://s3.cloud.cmctelecom.vn/dev-image-schoolly/avatar/48/medium/3dbad727-8c01-48d7-9126-2576b9432557.png",
                        "low": "https://s3.cloud.cmctelecom.vn/dev-image-schoolly/avatar/48/low/3dbad727-8c01-48d7-9126-2576b9432557.png"
                    },
                    "school_name": "Phòng GD&ĐT Huyện Chương Mỹ",
                    "rate": 5.0,
                    "elearning_total": 83,
                    "participant_total": 0
                },
                pageLoading: true,
                infoTeacher: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus accumsan quam non tempus. Quisque scelerisque porttitor sem, dictum dapibus tortor blandit vestibulum. Quisque scelerisque porttitor sem, dictum dapibus tortor blandit vestibulum. Quisque scelerisque porttitor sem, dictum dapibus tortor blandit vestibulum. Quisque scelerisque porttitor sem, dictum dapibus tortor blandit vestibulum. Quisque scelerisque porttitor sem, dictum dapibus tortor blandit vestibulum. Quisque scelerisque porttitor sem, dictum dapibus tortor blandit vestibulum. Quisque scelerisque porttitor sem, dictum dapibus tortor blandit vestibulum. Quisque scelerisque porttitor sem, dictum dapibus tortor blandit vestibulum. Quisque scelerisque porttitor sem, dictum dapibus tortor blandit vestibulum Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                readMoreActivated: false,
            }
        },
        async fetch({params, query, store}) {
            const userId = query.user_id
            // const getProfile = () =>
            //   store.dispatch(
            //     `elearning/public/public-elearning-teacher/${actionTypes.ELEARNING_PUBLIC_ELEARNING_TEACHER.LIST}`,
            //     {
            //         params: {
            //             teacher_id: userId
            //         }
            //     }
            //   );
            
            // const getElearnings = () =>
            //   store.dispatch(
            //     `elearning/public/public-teacher-els/${actionTypes.ELEARNING_PUBLIC_TEACHER_ELS.LIST}`,
            //     {
            //         params: {
            //             teacher_id: userId,
            //             size: 16,
            //             page: 1
            //         }
            //     }
            //   );
            //
            // return await Promise.all([
            //     getProfile(),
            //     getElearnings()
            // ])
        },
        components: {
            ProfileHead,
            ProfileSliderTab,
            CourseItem2,
            VclFacebook,
            VclList
        },
        computed: {
            // ...mapState("elearning/public/public-elearning-teacher", ["teacher"]),
            // ...mapState("elearning/public/public-teacher-els", ["elearnings"]),
        },
        methods: {
            activeReadMore() {
                // this.readMoreActivated = true;
            },
            get
        },
        mounted() {
            this.pageLoading = false;
        },
    }
</script>

<style lang="scss">
    @import "~/assets/scss/components/profile/_profile-student.scss";
</style>