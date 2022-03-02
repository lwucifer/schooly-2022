<template>
  <div class="container mb-6">
    <div v-if="!pageLoading">
      <!-- <breadcrumb /> -->
      <SchoolSummary :school="school"/>
      <ListScrollTo 
        @changeTab="changeTab"
        :tab="tab"
      />
      <div v-if="tab=='index'">
        <IntroSchool
          :organization="get(this,'organization',{})"
        />
        <div class="highlight" id="lesson">
          <ElearningHomeBox class="mb-0">
            <h2 slot="title" class="heading-3 font-weight-medium mb-4">Bài giảng nổi bật</h2>

            <AppCarouseSchool
              :options="{ slidesPerView: 4, spaceBetween: 24, preventClicksPropagation: false }"
              v-if="get(this,'highlightLecture.content.length',0)"
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
            <div v-else>Chưa có thông tin</div>
          </ElearningHomeBox>
        </div>

        <div class="highlight pt-0">
          <ElearningHomeBox>
            <h2 slot="title" class="heading-3 font-weight-medium mb-4">Khóa học nổi bật</h2>

            <AppCarouseSchool
              :options="{ slidesPerView: 4, spaceBetween: 24, preventClicksPropagation: false }"
              v-if="get(this,'highlightCourse.content.length',0)"
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
            <div v-else>Chưa có thông tin</div>
          </ElearningHomeBox>
        </div>

        <DataSchool :school="school"/>
        <ListTeacher/>
        <SchoolNoti/>
        <SchoolNews/>
        <SchoolLink/>
      </div>
      <SchoolIntroduceContent :organization="get(this,'organization',{})" v-else-if="tab=='intro'"/>
      <SchoolCoursesContent v-else-if="tab=='courses'"/>
      <SchoolNotifyContent v-else-if="tab=='notify'"/>
      <SchoolNewsContent v-else-if="tab=='news'"/>
      <SchoolScheduleContent v-else-if="tab=='schedule'"/>
    </div>
  </div>
</template>

<script>
import SchoolSummary from "~/components/page/school/SchoolSummary";
import ListScrollTo from "~/components/page/school/ListScrollTo";
import IntroSchool from "~/components/page/school/IntroSchool";
import ElearningHomeBox from "~/components/page/elearning/home/ElearningHomeBox";
import AppCarouseSchool from "~/components/page/school/AppCarouseSchool";
import CourseItem2 from "~/components/page/course/CourseItem2";
import DataSchool from "~/components/page/school/DataSchool";
import ListTeacher from "~/components/page/school/ListTeacher";
import SchoolNoti from "~/components/page/school/SchoolNoti";
import SchoolNews from "~/components/page/school/SchoolNews";
import SchoolLink from "~/components/page/school/SchoolLink";
import SchoolIntroduceContent from "~/components/page/school/Introduce/SchoolIntroduceContent";
import SchoolNotifyContent from "~/components/page/school/Notify/SchoolNotifyContent";
import SchoolNewsContent from "~/components/page/school/News/SchoolNewsContent";
import SchoolScheduleContent from "~/components/page/school/Schedule/SchoolScheduleContent";
import SchoolCoursesContent from "~/components/page/school/Courses/SchoolCoursesContent";

import IconArrowForwardIos from "~/assets/svg/v2-icons/arrow_forward_ios_24px.svg?inline";

import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { ELEARNING_TYPES, SUBJECT_CODE } from "~/utils/constants";
import { get } from "lodash";
import OlClass from '../../../services/elearning/teaching/Olclass';
import { getParamQuery } from "~/utils/common"

export default {
  watchQuery: ["school_id"],
  scrollToTop: true,
  components: {
    SchoolSummary,
    ListScrollTo,
    IntroSchool,
    ElearningHomeBox,
    AppCarouseSchool,
    CourseItem2,
    IconArrowForwardIos,
    DataSchool,
    ListTeacher,
    SchoolNoti,
    SchoolNews,
    SchoolLink,
    SchoolIntroduceContent,
    SchoolNotifyContent,
    SchoolNewsContent,
    SchoolScheduleContent,
    SchoolCoursesContent
  },
  watchQuery(newQuery, oldQuery){
    if (
      get(newQuery, 'tab', false) && 
      ['index', 'intro','courses','notify','news','schedule'].includes(get(newQuery, 'tab', false))
    ) {
      this.tab = get(newQuery, 'tab', 'index')
      window.scrollTo(0, 300);
    } else {
      this.tab = 'index'
    }
  },
  async fetch({ params, query, store }) {
    const school_id = params.id;
    const data = { school_id };
    await store.dispatch(
      `elearning/school/school-info/${actionTypes.SCHOOL_INFO.INFO}`,
      data
    );
    
    const getHighlightLecture = () =>
      store.dispatch(
        `elearning/school/school-highlight-elearning/${actionTypes.SCHOOL_HIGHTLIGHT_ELEARNING.LIST}`,
        {
          params: {
            type: ELEARNING_TYPES.LECTURE,
            school_id: data.school_id
          }
        }
      );

    const getHighlightCourse = () =>
      store.dispatch(
        `elearning/school/school-highlight-elearning/${actionTypes.SCHOOL_HIGHTLIGHT_ELEARNING.LIST}`,
        {
          params: {
            type: ELEARNING_TYPES.COURSE,
            school_id: data.school_id
          }
        }
      );
    
    return await Promise.all([
      getHighlightLecture(),
      getHighlightCourse()
    ]);
  },

  data() {
    return {
      pageLoading: true,
      tab:'index',
      oraganization:{}
    };
  },
  computed: {
    ...mapState("elearning/school/school-info", { school: "schoolInfo" }),
    ...mapState("elearning/school/school-organization", { organization: "schoolOrganization" }),
    ...mapState("elearning/school/school-highlight-elearning", [
      "highlightLecture",
      "highlightCourse"
    ]),
  },

  mounted() {
    this.pageLoading = false;
  },
  created(){
    this.checkTab(),
    this.fetchOrganization()
  },
  methods: {
    get,
    changeTab(tab){
      this.tab = tab
      this.$router.push({query: { tab: tab}})
    },
    checkTab(){
      const typeTab = getParamQuery('tab')
      if(typeTab && ['index', 'intro','courses','notify','news','schedule'].includes(typeTab)){
        this.tab = typeTab
      }else{
        this.tab = "index"
      }
    },
    async fetchOrganization(){
      const id = this.$route.params.id
      const data = {id: id};
      console.log(data)
      const rs = this.$store.dispatch(
        `elearning/school/school-organization/${actionTypes.SCHOOL_ORGANIZATION.LIST}`,
         data
      );
    },
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/pages/school/id/_school-id.scss";
</style>
