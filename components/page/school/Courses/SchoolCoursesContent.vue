<template>
    <div class="wrap-courses-school" v-if="!isSearch">
        <SchoolCoursesSubject @showSearch="searchElearning"/>
        <div class="highlight pt-0">
          <ElearningHomeBox>
            <h2 slot="title" class="heading-3 font-weight-medium mb-4">Bài giảng nổi bật</h2>

            <div v-if="get(this,'highlightLecture.content.length',0)">
              <AppCarouseSchool
                class="pb-2"
                :options="{ slidesPerView: 4, spaceBetween: 24, preventClicksPropagation: false,slidesPerColumn: get(this,'highlightLecture.content.length',0) > 4 ? 2 : 1  }"
              >
                <template slot="default" slot-scope="{ classes }">
                  <div
                    v-for="item in highlightLecture && highlightLecture.content || []"
                    :key="item.id"
                    :class="classes"
                  >
                    <CourseItem2 class="my-0" :item="item" :size="'sm'" />
                  </div>
                </template>
              </AppCarouseSchool>
              <div class="text-center mt-5">
                  <app-button class="btn-show-all" @click="getAllElearning('lecture')">Xem tất cả</app-button>
              </div>
            </div>
            <div v-else>Chưa có thông tin</div>
          </ElearningHomeBox>
        </div>
        <div class="highlight pt-0 mt-4">
          <ElearningHomeBox>
            <h2 slot="title" class="heading-3 font-weight-medium mb-4">Khóa học nổi bật</h2>

            <div v-if="get(this,'highlightCourse.content.length',0)">
              <AppCarouseSchool
                class="pb-2"
                :options="{ slidesPerView: 4, spaceBetween: 24, preventClicksPropagation: false,slidesPerColumn: get(this,'highlightCourse.content.length',0) > 7 ? 2 : 1 }"
              >
                <template slot="default" slot-scope="{ classes }">
                  <div
                    v-for="item in highlightCourse && highlightCourse.content || []"
                    :key="item.id"
                    :class="classes"
                  >
                    <CourseItem2 class="my-0" :item="item" :size="'sm'" />
                  </div>
                </template>
              </AppCarouseSchool>
              <div class="text-center mt-5">
                  <app-button class="btn-show-all" @click="getAllElearning('course')">Xem tất cả</app-button>
              </div>
            </div>
            <div v-else>Chưa có thông tin</div>
          </ElearningHomeBox>
        </div>
    </div>
    <SchoolCoursesSearch 
      v-else
    />
</template>

<script>
import SchoolCoursesSubject from "~/components/page/school/Courses/SchoolCoursesSubject"
import SchoolCoursesSearch from "~/components/page/school/Courses/SchoolCoursesSearch"
import AppCarouseSchool from "~/components/page/school/AppCarouseSchool";
import CourseItem2 from "~/components/page/course/CourseItem2";
import ElearningHomeBox from "~/components/page/elearning/home/ElearningHomeBox";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { ELEARNING_TYPES, SUBJECT_CODE } from "~/utils/constants";
import { get } from "lodash";
export default {
    components:{
        SchoolCoursesSubject,
        AppCarouseSchool,
        CourseItem2,
        ElearningHomeBox,
        SchoolCoursesSearch
    },
    data(){
        return{
            isSearch:false
        }
    },
    watch:{
      '$route.query'(news,old){
         this.checkQueryParams()
        },
    },
    methods:{
      
        fetchHighlightLecture(){
            const rs = this.$store.dispatch(
                `elearning/school/school-highlight-elearning/${actionTypes.SCHOOL_HIGHTLIGHT_ELEARNING.LIST}`,
                {
                  params: {
                    type: ELEARNING_TYPES.LECTURE,
                    school_id: this.$route.params.id,
                    size: 16
                  }
                }
            );
        },
        fetchtHighlightCourse(){
            const res = this.$store.dispatch(
                `elearning/school/school-highlight-elearning/${actionTypes.SCHOOL_HIGHTLIGHT_ELEARNING.LIST}`,
                {
                  params: {
                    type: ELEARNING_TYPES.COURSE,
                    school_id: this.$route.params.id,
                    size: 16
                  }
                }
            );
        },
      
        searchElearning(val){
            this.$router.push({query: { tab: 'courses', searchBy: 'subject', name: val.name}})
        },
        getAllElearning(str){
            this.$router.push({query: { tab: 'courses', searchBy: str,}})
        },
        checkQueryParams(){
          const searchParams = this.$route.query.searchBy
          const tabParams = this.$route.query.tab
          if(tabParams == 'courses' && searchParams){
            this.isSearch = true
          }
          else{
            this.isSearch = false
          }
        },
        get
    },
    created(){
      this.checkQueryParams()
      this.fetchHighlightLecture();
      this.fetchtHighlightCourse();
    },
    computed:{
        ...mapState("elearning/school/school-highlight-elearning", [
            "highlightCourse",
            "highlightLecture"
        ]),
    }
}
</script>

<style lang="scss" scroped>
@import "~assets/scss/components/school/_courses-school.scss";
</style>